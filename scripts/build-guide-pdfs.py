"""Create the two source-backed LN-IA PDFs and render them for inspection."""
from pathlib import Path
from xml.sax.saxutils import escape
import json
import shutil

from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak, Table, TableStyle, Flowable, KeepTogether
from reportlab.platypus.tableofcontents import TableOfContents
from pypdf import PdfReader
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output' / 'pdf'
QA = ROOT / 'qa' / 'pdf-guide'
PUBLIC = ROOT / 'public' / 'documents-candidats'
DATA = json.loads((ROOT / 'src' / 'guide-data.json').read_text(encoding='utf-8'))
GUIDE = 'guide-illustre-seance-02-module-01.pdf'
WORKBOOK = 'cahier-pratique-seance-02-module-01.pdf'
W, H = A4
INK = colors.HexColor('#142C43')
TEAL = colors.HexColor('#176B68')
GOLD = colors.HexColor('#A77B31')
MUTED = colors.HexColor('#536472')
LIGHT = colors.HexColor('#F2F5F4')
LINE = colors.HexColor('#D9E1E1')

def clean(text):
    return str(text).replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', '-').replace('\u00a0', ' ')

def html(text):
    return escape(clean(text)).replace('\n', '<br/>')

font_paths = [Path('C:/Windows/Fonts'), Path('/usr/share/fonts/truetype/dejavu')]
font_dir = next((p for p in font_paths if p.exists()), None)
if font_dir is None:
    raise RuntimeError('Install Arial or DejaVu Sans before generating PDFs.')
regular, bold = ('arial.ttf', 'arialbd.ttf') if (font_dir / 'arial.ttf').exists() else ('DejaVuSans.ttf', 'DejaVuSans-Bold.ttf')
pdfmetrics.registerFont(TTFont('Body', str(font_dir / regular)))
pdfmetrics.registerFont(TTFont('BodyBold', str(font_dir / bold)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='BodyBold', italic='Body', boldItalic='BodyBold')
S = getSampleStyleSheet()
for name, options in {
    'BodyText': dict(fontName='Body', fontSize=10.2, leading=14, textColor=INK, spaceAfter=6),
    'Heading1': dict(fontName='BodyBold', fontSize=25, leading=29, textColor=INK, spaceAfter=10),
    'Heading2': dict(fontName='BodyBold', fontSize=12, leading=16, textColor=TEAL, spaceBefore=9, spaceAfter=6),
}.items():
    for key, value in options.items():
        setattr(S[name], key, value)
S.add(ParagraphStyle('SmallText', parent=S['BodyText'], fontSize=8.6, leading=12, textColor=MUTED))
S.add(ParagraphStyle('Intro', parent=S['BodyText'], fontSize=11, leading=15, spaceAfter=12))
S.add(ParagraphStyle('Prompt', parent=S['BodyText'], fontName='Courier', fontSize=8.7, leading=11.9, spaceAfter=0))
S.add(ParagraphStyle('TableText', parent=S['BodyText'], fontSize=9.1, leading=12.5, spaceAfter=0))
S.add(ParagraphStyle('TableHead', parent=S['TableText'], fontName='BodyBold', textColor=colors.white))
S.add(ParagraphStyle('Kicker', parent=S['SmallText'], textColor=TEAL, fontName='BodyBold', spaceAfter=8))
S.add(ParagraphStyle('TOC', parent=S['BodyText'], fontSize=12, leading=20, spaceBefore=15, leftIndent=0, firstLineIndent=0))

def para(text, style='BodyText'):
    return Paragraph(html(text), S[style])

def draw_para(c, text, x, top, width, style='BodyText'):
    p = para(text, style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top - height)
    return top - height

def page_footer(c, page, label, destination='sommaire'):
    c.setStrokeColor(LINE)
    c.line(44, 46, W - 44, 46)
    c.setFillColor(MUTED)
    c.setFont('Body', 8)
    c.drawString(44, 30, f'LN-IA  /  {label}  /  28 septembre 2026')
    c.drawRightString(W - 44, 30, f'{page:02d}')
    c.setFillColor(TEAL)
    c.drawRightString(W - 68, 30, 'Sommaire')
    c.linkRect('', destination, (W - 127, 23, W - 63, 40), relative=0, thickness=0)

def cover(c, kind, filename, workbook=False):
    c.setFillColor(INK)
    c.rect(0, H - 345, W, 345, fill=1, stroke=0)
    c.drawImage(str(ROOT / 'public' / 'logo-ln-ia.png'), 44, H - 97, width=116, height=58, preserveAspectRatio=True, mask='auto')
    c.setFillColor(colors.HexColor('#C6E3DB'))
    c.setFont('BodyBold', 10)
    c.drawString(44, H - 128, f'{kind.upper()}  /  MODULE 01')
    c.setFillColor(colors.white)
    c.setFont('BodyBold', 31)
    lines = ['Mon cahier', 'de mise en pratique'] if workbook else ['Objectif personnel', 'et premières preuves']
    for i, line in enumerate(lines):
        c.drawString(44, H - 180 - i * 39, line)
    c.setFont('Body', 12)
    c.drawString(44, H - 275, 'Séance 02  ·  Challenge 100 Jours LN-IA')
    c.drawString(44, H - 298, 'Lundi 28 septembre 2026  ·  Rencontre sur Zoom')
    c.setFillColor(GOLD)
    c.rect(44, H - 346, 80, 4, stroke=0, fill=1)
    y = H - 385
    y = draw_para(c, 'Prof. Abderrahman EL HISSE', 44, y, W - 88, 'Heading2')
    y = draw_para(c, 'Professeur agrégé de physique · Formateur et coach', 44, y - 7, W - 88, 'SmallText')
    y = draw_para(c, 'Clarifier un besoin, choisir trois livrables, contrôler une réponse et conserver une preuve.' if not workbook else 'Écrire, tester, vérifier et garder une trace de ses décisions. Les champs peuvent être remplis dans un lecteur PDF compatible ou à la main.', 44, y - 27, W - 88, 'Intro')
    for i, (big, text) in enumerate([('100', 'minutes de pratique'), ('3', 'livrables à définir'), ('1', 'première preuve')]):
        x = 44 + i * 172
        c.setFillColor(LIGHT)
        c.roundRect(x, 134, 156, 81, 8, stroke=0, fill=1)
        c.setFillColor(TEAL)
        c.setFont('BodyBold', 27)
        c.drawString(x + 14, 176, big)
        c.setFont('Body', 9)
        c.drawString(x + 14, 151, text)
    c.setFillColor(MUTED)
    c.setFont('Body', 8.5)
    c.drawString(44, 103, 'Sommaire cliquable et signets disponibles dans le lecteur PDF.')
    page_footer(c, 1, kind)

class CycleDiagram(Flowable):
    def __init__(self, steps):
        Flowable.__init__(self)
        self.steps = steps
        self.width, self.height = W - 88, 87

    def draw(self):
        c = self.canv
        for i, step in enumerate(self.steps):
            x, y = i * 73, 13
            human = i in (3, 4)
            c.setFillColor(TEAL if human else LIGHT)
            c.roundRect(x, y, 67, 65, 5, fill=1, stroke=0)
            c.setFillColor(colors.white if human else TEAL)
            c.setFont('BodyBold', 11)
            c.drawString(x + 8, y + 44, f'{i + 1:02d}')
            style = ParagraphStyle('Node', parent=S['SmallText'], fontSize=7.1, leading=10, textColor=colors.white if human else INK, fontName='BodyBold')
            p = Paragraph(html(step['name']), style)
            _, h = p.wrap(53, 38)
            p.drawOn(c, x + 7, y + 29 - h)
            if i < 6:
                c.setStrokeColor(GOLD)
                c.line(x + 68, y + 33, x + 72, y + 33)

class GuideDoc(BaseDocTemplate):
    def __init__(self, target):
        super().__init__(str(target), pagesize=A4, leftMargin=44, rightMargin=44, topMargin=57, bottomMargin=59,
                         title=DATA['title'], author=DATA['author'], subject='Guide illustré de la séance 02 LN-IA', pageCompression=1)
        frame = Frame(44, 59, W - 88, H - 116, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        self.addPageTemplates(PageTemplate(id='guide', frames=[frame], onPage=self.decorate))

    def decorate(self, c, doc):
        if doc.page == 1:
            cover(c, 'Guide illustré', GUIDE)
        else:
            c.setFont('Body', 8)
            c.setFillColor(MUTED)
            c.drawString(44, H - 31, 'GUIDE DE LA SÉANCE 02  /  OBJECTIF, LIVRABLES ET AUTONOMIE')
            page_footer(c, doc.page, 'Guide illustré')

    def afterFlowable(self, flowable):
        if hasattr(flowable, 'destination'):
            self.canv.bookmarkPage(flowable.destination)
            self.canv.addOutlineEntry(flowable.getPlainText(), flowable.destination, 0, False)
            if flowable.destination != 'sommaire':
                self.notify('TOCEntry', (0, flowable.getPlainText(), self.page, flowable.destination))

def block_flows(block):
    result = [para(block['title'], 'Heading2')]
    kind = block['type']
    if kind in ('text', 'callout', 'quote'):
        text = block['text']
        if kind == 'quote':
            text = '« ' + text + ' »'
        if kind in ('callout', 'quote'):
            table = Table([[para(text)]], colWidths=[W - 88])
            table.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), LIGHT), ('BOX', (0, 0), (-1, -1), .4, LINE), ('LEFTPADDING', (0, 0), (-1, -1), 13), ('RIGHTPADDING', (0, 0), (-1, -1), 13), ('TOPPADDING', (0, 0), (-1, -1), 11), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
            result.append(table)
        else:
            result.append(para(text))
    elif kind in ('list', 'checklist'):
        result += [para(f'{i + 1:02d}. {item}') for i, item in enumerate(block['items'])]
    elif kind == 'rubrics':
        result += [Paragraph(f'<b>{i + 1:02d}. {html(item["title"])}</b><br/>{html(item["text"])}', S['BodyText']) for i, item in enumerate(block['items'])]
    elif kind == 'cycle':
        result.append(CycleDiagram(block['steps']))
        result += [Paragraph(f'<b>{i + 1}. {html(item["name"])}</b> - {html(item["text"])}', S['BodyText']) for i, item in enumerate(block['steps'])]
    elif kind == 'table':
        rows = [[para(v, 'TableHead') for v in block['heads']]] + [[para(v, 'TableText') for v in row] for row in block['rows']]
        widths = [117, W - 205] if len(block['heads']) == 2 else [89, 158, W - 335]
        if block['heads'][0] == 'Livrable':
            widths = [174, 156, W - 418]
        table = Table(rows, colWidths=widths, repeatRows=1, hAlign='LEFT')
        table.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), INK), ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT]), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 9), ('RIGHTPADDING', (0, 0), (-1, -1), 9), ('TOPPADDING', (0, 0), (-1, -1), 7), ('BOTTOMPADDING', (0, 0), (-1, -1), 7), ('LINEBELOW', (0, 0), (-1, -1), .3, LINE)]))
        result.append(table)
    elif kind == 'prompt':
        style = ParagraphStyle('PromptBox', parent=S['Prompt'], backColor=LIGHT, borderPadding=12, spaceBefore=8, spaceAfter=12)
        result.append(Paragraph(html(block['text']), style))
    elif kind == 'folders':
        for folder in block['folders']:
            result.append(Paragraph(f'<b>{html(folder["name"])}</b> - {html(folder["role"])}', S['BodyText']))
            result.append(para('\n'.join('    ' + name for name in folder['files']), 'Prompt'))
            result.append(Spacer(1, 10))
    elif kind == 'links':
        for link in block['items']:
            result.append(Paragraph(f'<link href="{escape(link["url"])}" color="#176B68"><u>{html(link["text"])}</u></link>', S['BodyText']))
    return result

def create_guide():
    story = [Spacer(1, 1), PageBreak()]
    title = para('Sommaire', 'Heading1')
    title.destination = 'sommaire'
    story += [title, para('Un parcours à lire, à essayer et à vérifier. Cliquez sur un chapitre ou utilisez les signets du lecteur PDF.', 'Intro')]
    toc = TableOfContents()
    toc.levelStyles = [S['TOC']]
    story += [toc, Spacer(1, 33), para('Deux supports complémentaires', 'Heading2'), para('Ce guide explique la méthode et conserve les prompts. Le cahier pratique permet de préparer vos réponses et de renseigner vos contrôles.'), Paragraph(f'<link href="{WORKBOOK}" color="#176B68"><u>Ouvrir le cahier pratique</u></link>', S['BodyText']), para('Source : Guide de présentation de la séance 02 du Module 01, édition du 28 septembre 2026, Prof. Abderrahman EL HISSE.', 'SmallText')]
    for chapter in DATA['chapters']:
        story += [PageBreak(), para(f'{chapter["phase"].upper()}  /  {chapter["time"]}', 'Kicker')]
        heading = para(f'{chapter["number"]}  {chapter["title"]}', 'Heading1')
        heading.destination = chapter['id']
        story += [heading, para(chapter['intro'], 'Intro')]
        for block in chapter['blocks']:
            story += block_flows(block)
        story += [Spacer(1, 8), KeepTogether([para('Votre prochaine action', 'Heading2'), para(chapter['action'])])]
    GuideDoc(OUT / GUIDE).multiBuild(story)

FIELD_NAMES = []

def field(c, name, label, x, top, width, height=45):
    FIELD_NAMES.append(name)
    draw_para(c, label, x, top, width, 'SmallText')
    y = top - 18 - height
    c.acroForm.textfield(name=name, tooltip=clean(label), x=x, y=y, width=width, height=height,
                        fontName='Helvetica', fontSize=10, textColor=INK, borderColor=LINE,
                        fillColor=colors.HexColor('#F6F8F7'), borderWidth=.7, forceBorder=True,
                        fieldFlags='multiline', maxlen=4000 if height >= 50 else 500, value='')
    return y - 17

def workbook_page(c, number, destination, title, intro):
    c.bookmarkPage(destination)
    c.addOutlineEntry(title, destination, 0, False)
    c.setFillColor(TEAL)
    c.setFont('BodyBold', 9)
    c.drawString(44, H - 42, 'CAHIER PRATIQUE  /  SÉANCE 02  /  ' + (f'{number - 1:02d}' if number > 1 else 'MODE D’EMPLOI'))
    draw_para(c, title, 44, H - 65, W - 88, 'Heading1')
    draw_para(c, intro, 44, H - 108, W - 88, 'BodyText')
    page_footer(c, number, 'Cahier pratique')

def create_workbook():
    c = canvas.Canvas(str(OUT / WORKBOOK), pagesize=A4, pageCompression=1)
    c.setTitle('Cahier pratique - Séance 02 du Module 01 LN-IA')
    c.setAuthor(DATA['author'])
    c.setSubject('Exercices et champs à remplir pour préparer son objectif et sa preuve')
    destinations = [('objectif', 'Mon objectif en quatre rubriques'), ('livrables', 'Mes trois livrables'), ('prompt', 'Ma demande et ma correction'), ('dossiers', 'Mon classement et ma sauvegarde'), ('preuve', 'Ma preuve datée'), ('bilan', 'Mon bilan'), ('suite', 'Ma prochaine action')]
    # Compact opening page with a functional table of contents.
    workbook_page(c, 1, 'sommaire', 'Mon cahier de pratique', 'Objectif personnel, trois livrables et première preuve. Un support à compléter pendant les ateliers, puis à conserver dans votre espace personnel.')
    c.drawImage(str(ROOT / 'public' / 'logo-ln-ia.png'), W - 151, H - 100, width=105, height=52, preserveAspectRatio=True, mask='auto')
    y = H - 172
    for i, (dest, label) in enumerate(destinations):
        c.setFillColor(LIGHT)
        c.roundRect(44, y - 44, W - 88, 41, 5, fill=1, stroke=0)
        c.setFillColor(TEAL)
        c.setFont('BodyBold', 11)
        c.drawString(57, y - 28, f'{i + 1:02d}')
        c.setFillColor(INK)
        c.setFont('Body', 11)
        c.drawString(88, y - 28, label)
        c.drawRightString(W - 59, y - 28, str(i + 2))
        c.linkRect('', dest, (44, y - 44, W - 44, y), thickness=0)
        y -= 51
    y = draw_para(c, 'Comment utiliser ce cahier', 44, y - 23, W - 88, 'Heading2')
    y = draw_para(c, 'Cliquez sur les champs pour écrire, puis enregistrez une copie du PDF et rouvrez-la pour vérifier vos réponses. Selon le lecteur PDF, le remplissage peut être limité ; le cahier reste imprimable. Aucun formulaire de ce document n’envoie vos réponses.', 44, y - 8, W - 88)
    draw_para(c, 'Prof. Abderrahman EL HISSE · 28 septembre 2026\nAdaptation pratique du guide de présentation de la séance 02 du Module 01.', 44, y - 22, W - 88, 'SmallText')
    c.showPage()
    workbook_page(c, 2, 'objectif', 'Mon objectif personnel', 'Atelier 1 · Écrivez avec vos mots. Une synthèse de dix lignes environ sera ensuite conservée dans 01-depart/objectif-personnel-challenge.md.')
    y = H - 166
    for key, label in [('depart', '01  Mon point de départ : activité, expérience, difficulté'), ('production', '02  Ce que je veux apprendre à produire : public et besoin'), ('attentes', '03  Mes preuves attendues : fichiers, contrôles, explications'), ('projets', '04  Mes trois premiers livrables : trois réalisations distinctes')]:
        y = field(c, 'objectif_' + key, label, 44, y, W - 88, 88)
    draw_para(c, 'À vérifier : mon objectif permet de comprendre pour qui je travaille, ce que je veux produire et comment je contrôlerai le résultat.', 44, y - 4, W - 88, 'SmallText')
    c.showPage()
    workbook_page(c, 3, 'livrables', 'Mes trois livrables', 'Atelier 1 · Définissez les projets aujourd’hui. Leur réalisation se poursuit pendant le parcours. Une date peut rester à confirmer.')
    y = H - 166
    for i in range(1, 4):
        c.setFillColor(TEAL)
        c.setFont('BodyBold', 12)
        c.drawString(44, y, f'LIVRABLE {i}')
        field(c, f'livrable_{i}_nom', 'Nom de la réalisation', 44, y - 14, 243, 25)
        field(c, f'livrable_{i}_public', 'Public bénéficiaire', 307, y - 14, 244, 25)
        field(c, f'livrable_{i}_utilite', 'Utilité et format', 44, y - 69, 243, 33)
        field(c, f'livrable_{i}_controle', 'Premier contrôle à réaliser', 307, y - 69, 244, 33)
        field(c, f'livrable_{i}_date', 'Date cible', 44, y - 132, 125, 24)
        field(c, f'livrable_{i}_action', 'Prochaine action', 188, y - 132, 363, 24)
        y -= 203
    c.showPage()
    workbook_page(c, 4, 'prompt', 'Ma demande et ma correction', 'Atelier 2 · Retirez les renseignements personnels inutiles. Utilisez le prompt du guide, puis conservez la demande réellement utilisée et votre décision.')
    y = field(c, 'prompt_brouillon', 'Mon brouillon initial', 44, H - 170, W - 88, 77)
    field(c, 'prompt_public', 'Mon public ou bénéficiaire', 44, y, 243, 34)
    y = field(c, 'prompt_contraintes', 'Mes contraintes de temps et de moyens', 307, y, 244, 34)
    y = field(c, 'prompt_reponse', 'Le passage de la réponse à vérifier', 44, y, W - 88, 72)
    y = field(c, 'prompt_correction', 'Ma correction précise et la raison de ce choix', 44, y, W - 88, 83)
    y = field(c, 'prompt_retenu', 'La formulation que je retiens après relecture', 44, y, W - 88, 62)
    draw_para(c, 'Sauvegarde : brouillon, prompt, réponse utile, date et décision dans 02-prompts/premiers-prompts.md. L’objectif contient la version retenue.', 44, y - 5, W - 88, 'SmallText')
    c.showPage()
    workbook_page(c, 5, 'dossiers', 'Mon classement et ma sauvegarde', 'Atelier 3 · Créez les sous-dossiers manquants et retrouvez vos fichiers. Cochez uniquement les gestes que vous avez réellement refaits.')
    y = H - 173
    for folder in DATA['chapters'][4]['blocks'][0]['folders']:
        y = draw_para(c, folder['name'], 44, y, W - 88, 'Heading2')
        y = draw_para(c, ' / '.join(folder['files']), 44, y - 5, W - 88, 'SmallText') - 10
    for i, text in enumerate(['J’ai ouvert mon dossier personnel.', 'J’ai enregistré avec Ctrl+S ou Cmd+S.', 'J’ai fermé puis rouvert le fichier.', 'La dernière modification est visible.']):
        name = f'geste_{i + 1}'
        FIELD_NAMES.append(name)
        c.acroForm.checkbox(name=name, tooltip=text, x=45, y=y - 15, size=13, checked=False, borderColor=TEAL, fillColor=colors.white, buttonStyle='check', forceBorder=True)
        draw_para(c, text, 69, y, W - 115)
        y -= 32
    y = field(c, 'dossier_chemin', 'Le chemin du fichier que j’ai rouvert', 44, y - 6, W - 88, 35)
    field(c, 'dossier_phrase', 'La dernière phrase ou modification que j’ai retrouvée', 44, y, W - 88, 61)
    c.showPage()
    workbook_page(c, 6, 'preuve', 'Ma première preuve datée', 'À remplir après l’action. Reportez cette trace dans 04-portfolio-preuves/preuves-semaine-01.md. Une capture peut compléter votre explication.')
    y = H - 166
    field(c, 'preuve_date', 'Date réelle et version', 44, y, 170, 25)
    y = field(c, 'preuve_fichier', 'Fichier examiné', 234, y, 317, 25)
    for key, label, height in [('objectif', 'Objectif travaillé', 36), ('controle', 'Contrôle réalisé : ce que j’ai vérifié', 54), ('resultat', 'Résultat observé : ce que j’ai constaté', 54), ('correction', 'Correction décidée et geste que je sais expliquer', 60), ('suite', 'Élément à compléter, prochaine action et date cible', 50), ('piece', 'Pièce associée et relecture éventuelle réellement effectuée', 35)]:
        y = field(c, 'preuve_' + key, label, 44, y, W - 88, height)
    draw_para(c, 'Si vous avez relu seul, indiquez autocontrôle. Mentionnez une relecture par un pair uniquement si elle a eu lieu.', 44, y, W - 88, 'SmallText')
    c.showPage()
    workbook_page(c, 7, 'bilan', 'Mon bilan en une minute', 'Bilan · Choisissez un statut honnête. Réalisé signifie que vous pouvez montrer l’action ou le résultat. Les statuts commencent à Non vérifié.')
    y = H - 181
    for i, item in enumerate(DATA['chapters'][6]['blocks'][0]['items']):
        draw_para(c, item, 44, y, 315)
        name = f'bilan_{i + 1}'
        FIELD_NAMES.append(name)
        c.acroForm.choice(name=name, tooltip=item, value='Non vérifié', options=['Non vérifié', 'À compléter', 'Réalisé'],
                          x=382, y=y - 29, width=169, height=27, fontName='Helvetica', fontSize=10,
                          borderColor=LINE, fillColor=LIGHT, textColor=INK, fieldFlags='combo', forceBorder=True)
        y -= 57
    y = field(c, 'bilan_difficulte', 'La difficulté précise que je veux transmettre au formateur', 44, y - 2, W - 88, 61)
    draw_para(c, 'Pour parler une minute : Mon besoin est… Mon premier livrable sera… J’ai corrigé… Mon fichier se trouve… Ma prochaine action est…', 44, y - 7, W - 88, 'SmallText')
    c.showPage()
    workbook_page(c, 8, 'suite', 'Ma prochaine action', 'Après la séance · Choisissez une action limitée et une date réaliste. Conservez ce cahier rempli dans votre espace personnel.')
    y = H - 171
    for key, label, height in [('choix', 'Je commence par ce livrable parce que…', 62), ('action', 'Ma prochaine action concrète et sa date cible', 58), ('resultat', 'Le résultat que je pourrai montrer et le contrôle prévu', 65), ('message', 'Mon message de suivi : réalisation, correction, preuve et difficulté restante', 132)]:
        y = field(c, 'suite_' + key, label, 44, y, W - 88, height)
    draw_para(c, 'Remise : préparez l’objectif corrigé, la liste des trois livrables et l’entrée de preuve. Utilisez le canal privé indiqué par le formateur. Complétez séparément la fiche candidat Word.', 44, y - 7, W - 88, 'SmallText')
    c.save()

def validate_and_render():
    report = {}
    for filename in [GUIDE, WORKBOOK]:
        target = OUT / filename
        reader = PdfReader(target)
        assert reader.outline, f'No bookmarks: {filename}'
        assert all(page.extract_text().strip() for page in reader.pages)
        fields = reader.get_fields() or {}
        if filename == WORKBOOK:
            assert set(FIELD_NAMES) == set(fields), 'Field tree mismatch'
            assert len(reader.pages) == 8, 'Workbook must contain eight pages'
            for name, values in fields.items():
                expected = 'Non vérifié' if name.startswith('bilan_') and name != 'bilan_difficulte' else '/Off' if name.startswith('geste_') else ''
                assert str(values.get('/V', '')) == expected, (name, values.get('/V'))
            widgets = [a.get_object() for p in reader.pages for a in p.get('/Annots', []) if a.get_object().get('/Subtype') == '/Widget']
            assert len(widgets) == len(FIELD_NAMES)
            for widget in widgets:
                assert widget.get('/AP', {}).get('/N') is not None, widget.get('/T')
                assert str(widget.get('/V', '')) == str(fields[widget['/T']].get('/V', ''))
        doc = pymupdf.open(target)
        images = QA / target.stem
        images.mkdir(parents=True, exist_ok=True)
        for stale in images.glob('page-*.png'):
            if int(stale.stem.split('-')[1]) > len(doc):
                stale.unlink()
        for n, page in enumerate(doc):
            page.get_pixmap(matrix=pymupdf.Matrix(1.3, 1.3), alpha=False).save(images / f'page-{n + 1:02d}.png')
        report[filename] = {'pages': len(reader.pages), 'fields': len(fields), 'bookmarks': len(reader.outline), 'links': sum(len(p.get_links()) for p in doc)}
        shutil.copy2(target, PUBLIC / filename)
    (QA / 'validation.json').write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    print(json.dumps(report, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    QA.mkdir(parents=True, exist_ok=True)
    create_guide()
    create_workbook()
    validate_and_render()
