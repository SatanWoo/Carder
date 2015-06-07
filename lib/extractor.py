#!/usr/bin/python
# -*- coding:utf-8 -*-
# Created Time: Fri Jun  5 11:59:09 2015
# Purpose: extract web article
# Mail: hewr2010@gmail.com
__author__ = "Wayne Ho"

import re
import os
import sys
import json
from bs4 import BeautifulSoup
import urllib, cStringIO
from PIL import Image
import jieba
import jieba.analyse
jieba.setLogLevel(60)  # disable loading messages
import logging
logging.basicConfig(
    format='%(asctime)s [%(levelname)s]  %(message)s',
    level=logging.INFO,
    filename="backtest.log",
    filemode='w'
)
logging.getLogger().addHandler(logging.StreamHandler())


def readFile(fname):
    """read a file, or via stdin
    @param fname: file name
    @type fname: str
    @return: str
    """
    return (open(fname) if fname != "" else sys.stdin).read()


def preprocess(raw_text):
    """preprocess raw text content
    @param text: raw html content
    @type text: str
    @return: str
    return ""
    """
    text = re.compile(r'\r\n|\n\r|\r').sub(" ", raw_text)  # new line
    # trans code
    for r, c, in [
        (re.compile(r'&quot;', re.I | re.S), '\"'),
        (re.compile(r'&amp;', re.I | re.S), '&'),
        (re.compile(r'&lt;', re.I | re.S), '<'),
        (re.compile(r'&gt;', re.I | re.S), '>'),
        (re.compile(r'&nbsp;', re.I | re.S), ' '),
        (re.compile(r'&#34;', re.I | re.S), '\"'),
        (re.compile(r'&#38;', re.I | re.S), '&'),
        (re.compile(r'&#60;', re.I | re.S), '<'),
        (re.compile(r'&#62;', re.I | re.S), '>'),
        (re.compile(r'&#160;', re.I | re.S), ' ')
    ]:
        text = r.sub(c, text)
    text = re.compile(
        r'<!DOCTYPE[^>]*?>', re.I | re.S).sub("", text)  # doctype
    text = re.compile(r'<!--.*?-->', re.I | re.S).sub("", text)  # annotation
    text = re.compile(r'^[ \t]+', re.M).sub("", text)  # leading spaces
    text = re.compile(r'[ \t]+', re.M).sub(" ", text)  # spaces
    return text


def removeTags(text):
    """remove all html tags
    @param text: text content
    @type text: str
    @return: str
    """
    text = re.compile(r'<script[^>]*?>.*?</script>', re.I | re.S)\
        .sub("\n", text)
    text = re.compile(r'<style[^>]*?>.*?</style>', re.I | re.S).sub("\n", text)
    #text = re.compile(r'<img[^>]*?>', re.I | re.S).sub("|imgtag|\n", text)
    #text = processImages(text)
    #text = re.compile(r'<a[^>]*?>.*?</a>', re.I | re.S).sub(" ", text)
    text = re.compile(r'<[^>]*?>', re.I | re.S).sub("\n", text)
    return text


def processImages(text):
    """mark all <img> in html text content
    @param text: html text content
    @type text: str
    @return: str
    """
    bs = BeautifulSoup(text)
    for img in bs.findAll("img"):
        if not img.has_attr("src"):
            continue
        img.replaceWith("\n|tag(img)[%s]|\n" % img["src"])
    return bs.text.encode("utf8")


def getWebImageSize(url):
    """return width and height of image via web (without loading whole image)
    @param url: url of the image
    @type url: str
    @return: (int, int)
    """
    try:
        logging.debug("retrieve image %s" % url)
        img_io = cStringIO.StringIO(urllib.urlopen(url).read())
        im = Image.open(img_io)
        width, height = im.size
        logging.debug("image size %dx%d" % (width, height))
        return width, height
    except Exception as exception:
        logging.error(exception.__class__.__name__ + "\t" + url)
        return -1, -1


def getBlocks(lines, threshold):
    """get line blocks
    @param lines: html lines
    @type lines: [str]
    @param threshold: threshold for main blocks retrieval (needed by algo.)
    @type threshold: float
    @return: [str]
    """
    lens = [len(line) for line in lines]
    K = 3  # argument: number of context lines
    blocks = []
    head = 0
    for tail in xrange(len(lens)):
        if sum(lens[tail:tail + K]) <= 3 and tail > head:
            if sum(lens[head:tail]) >= threshold:
                blocks.append((head, tail))
            head = tail + K
            while head < len(lens) and lens[head] <= 2:
                head += 1
        if tail == len(lens) - 1:
            if sum(lens[head:tail]) >= threshold:
                blocks.append((head, tail))
    return blocks


def evaluateBlocks(blocks, lines):
    """estimate values of line blocks
    @param blocks: line blocks
    @type blocks: [str]
    @param lines: html lines
    @type lines: [str]
    @return: [float]
    """
    if len(lines) == 0:
        return []
    scores = []
    for head, tail in blocks:
        text = "\n".join(lines[head:tail])
        avail_lines = sum([1 for line in lines[head:tail] if len(line) > 0])
        #avail_lines = tail - head
        position_rate = (len(lines) - head - 1.) / len(lines)
        text_density = float(len(text)) / avail_lines
        punc_density = float(len(
            re.compile(r'\. |,|\?|!|:|;|。|，|？|！|：|；|《|》|%|、|“|”',
                       re.I | re.S)
            .findall(text)
        )) / avail_lines  # punctuation
        score = (position_rate ** 0.5) * text_density * (punc_density ** 0.5)
        scores.append(score)
    return scores


def getArticleBlock(lines, blocks, scores, algo="upsurge"):
    """return a block containing main article
    @param lines: html lines
    @type lines: [str]
    @param blocks: line blocks
    @type blocks: [str]
    @param scores: score of line blocks
    @type scores: [float]
    @param algo: name of block retrieving algorithms
    @value algo: "upsurge", "max_average" 
    @type algo: str
    @return: (int, int)
    """
    # find the best block
    opt_idx, opt_score = -1, -1.
    for i, score in enumerate(scores):
        if score > opt_score:
            opt_idx, opt_score = i, score
    if algo == "upsurge":
        head, tail = opt_idx, opt_idx
        while tail < len(blocks) - 1 and scores[tail + 1] > 1e-6:
            tail += 1
        while head > 0:
            ratio = float(scores[head] - scores[head - 1]) / scores[head]
            if ratio > 0.95:
                break
            head -= 1
        return (blocks[head][0], blocks[tail][1])
    elif algo == "max_average":
        # merge neighbours
        opt_block = blocks[opt_idx]
        for stride in [-1, 1]:
            i = opt_idx + stride
            while i >= 0 and i < len(blocks):
                nblock = (opt_block[0], blocks[i][1]) if stride > 0 else\
                    (blocks[i][0], opt_block[1])
                score = evaluateBlocks([nblock], lines)[0]
                if score > opt_score:
                    opt_score = score
                    opt_block = nblock
                    i += stride
                else:
                    break
        return opt_block
    return blocks[opt_idx]


def extractContent(text, threshold, need_scraps=False):
    """extract main content from a web article page
    @param text: preprocessed text content
    @type text: str
    @param threshold: threshold for main blocks retrieval (needed by algo.)
    @type threshold: float
    @param need_scraps: return lines, blocks and scores which build up text
    @type need_scraps: bool
    @return: str | (str, {name:list})
    """
    text = removeTags(text)
    lines = text.split("\n")
    blocks = getBlocks(lines, threshold)
    scores = evaluateBlocks(blocks, lines)  # measure blocks
    # DEBUG
    for item in zip(blocks, scores):
        logging.debug(item)
        logging.debug("\t" + " ".join(lines[item[0][0]:item[0][1]]))
    block = getArticleBlock(lines, blocks, scores)
    logging.debug("content line index " + str(block))
    text = "\n".join([line for line in lines[block[0]:block[1]] if line != ""])
    if not need_scraps:
        return text
    else:
        return text, {
            #"content_lines": lines[block[0]:block[1]],
            "index": block,
            "lines": lines,
            "blocks": blocks,
            "scores": scores
        }


def extractTitle(text):
    """extract title from html text content
    @param text: preprocessed text content
    @type text: str
    @return: str
    """
    bs = BeautifulSoup(text)
    tabs = bs.findAll("h1")
    if len(tabs) == 0:
        for h in ["h2", "h3"]:
            for item in bs.findAll(h):
                if (item.has_attr("class") and\
                        any([x.find("title") != -1 for x in item["class"]]))\
                        or (item.has_attr("id") and\
                            any([x.find("title") != -1 for x in item["id"]])):
                    return item.text.encode("utf8")
        tabs = bs.findAll("title")
    if not tabs:
        return ""
    return re.sub(" |\n", "", tabs[-1].text.encode("utf8"))


def extractImages(text, title, lines, blocks, index):
    """extract reasonable images
    @param text: html text content
    @type text: str
    @param title: extracted title
    @type title: str
    @param lines: html lines
    @type lines: [str]
    @param blocks: line blocks
    @type blocks: [str]
    @param index: main content's index of lines
    @type index: (int, int)
    @return: [str]
    """
    tag_lines = text.split("\n")
    # match original indexes of tag-removed textlines
    line_idx = []
    idx = 0
    for line in lines:
        if line == "":
            line_idx.append(-1)
        else:
            while idx < len(tag_lines) - 1 and tag_lines[idx].find(line) == -1:
                idx += 1
            assert(idx < len(tag_lines))
            line_idx.append(idx)
    # find index of title line
    title_idx = line_idx[index[0]]
    while title_idx >= 0 and tag_lines[title_idx].find(title) == -1:
        title_idx -= 1
    if title_idx == -1:
        title_idx = line_idx[index[0]]
    # parse all <img> between main content and title
    html = "".join([l for l in tag_lines[title_idx:line_idx[index[1] - 1] + 1]])
    bs = BeautifulSoup(html)
    imgs = []
    for img in bs.findAll("img"):
        if img.has_attr("src"):
            obj = {"src": img["src"].encode("utf8")}
            if img.has_attr("width"):
                obj["width"] = int(img["width"])
            if img.has_attr("height"):
                obj["height"] = int(img["height"])
            imgs.append(obj)
    for img in imgs:
        logging.debug(str(img))
    legal_imgs = []
    for img in imgs:
        if len(img.items()) < 3:
            img["width"], img["height"] = getWebImageSize(img["src"])
        w, h = img["width"], img["height"]
        if w >= 250 and h >= 250 and w * h >= 400 ** 2:
            legal_imgs.append(img["src"])
    return legal_imgs


def extract(raw_text, threshold=10):
    """extract main content, title and keywords from a web article page
    @param raw_text: raw html content
    @type raw_text: str
    @param threshold: threshold for main blocks retrieval (needed by algo.)
    @type threshold: float
    @return: {content, title, keywords}
    """
    text = preprocess(raw_text)
    # main content
    content, info = extractContent(text, threshold, need_scraps=True)
    content_lines = info["lines"][info["index"][0]:info["index"][1]]
    # prepare html for title retrieval
    content_pos = text.find(content_lines[0])
    title_html = text if content_pos == -1 else text[:content_pos]
    title = extractTitle(title_html)
    # keywords
    keywords = [w.encode("utf8") for w in jieba.analyse.extract_tags(
        content,
        topK=5
    )]
    # pictures
    images = extractImages(text, title,
                           info["lines"], info["blocks"], info["index"])
    return {
        "title": title,
        "content": content,
        "keywords": keywords,
        "images": images
    }


def getArguments():
    """works for __main__, return arguments
    @return: argparse
    """
    import argparse
    parser = argparse.ArgumentParser(description='Carder Article Retrieval')
    parser.add_argument("--file", "-f",
                        help="read from file",
                        required=False,
                        default="",
                        type=str)
    parser.add_argument("--debug", "-g",
                        help="log debug massages",
                        action="store_true")
    parser.add_argument("--human",
                        help="human readable log information",
                        action="store_true")
    args = parser.parse_args()
    return args


def parseVideo(url):
    """detect whether it's a video webpage, return its brand
    @param url: url
    @type url: str
    @return: str
    """
    types = ["tudou", "youku"]
    for _type in types:
        if url.find(_type + ".com/") != -1:
            return _type
    return ""

if __name__ == "__main__":
    args = getArguments()
    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)
    raw = json.loads(readFile(args.file))
    video_web = parseVideo(raw["url"])
    if video_web != "":
        info = {"type": "video"}
        url = raw["url"]
        if video_web == "tudou":
            if url.find("programs") != -1:  # program
                if url[-1] == "/":
                    url = url[:-1]
            else:  # album
                url = os.path.splitext(url)[0]
            # parse url
            i = len(url) - 1
            while i >= 0 and url[i] != "/":
                i -= 1
            assert(i >= 0)
            vid = url[i + 1:]
            info["url"] = "http://www.tudou.com/programs/view/html5embed.action?code=%s" % vid
        elif video_web == "youku":
            vid = url[url.find("v_show/id_") + 10:url.find(".html")]
            info["url"] = "http://player.youku.com/embed/%s" % vid
    else:
        raw_text = raw["html"].encode("utf8")
        info = extract(raw_text)
        info["type"] = "article"
    # output
    if args.human:
        for key, value in info.items():
            logging.info("【%s】\n%s\n" % (key, json.dumps(
                value,
                ensure_ascii=False
            ) if type(value) is not str else value))
    else:
        print json.dumps(info, ensure_ascii=False)
