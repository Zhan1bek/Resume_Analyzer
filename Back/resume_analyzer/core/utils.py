import re
import PyPDF2
import docx
import nltk
import spacy


try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt")
# Загрузим spacy-модель (en_core_web_sm)
nlp = spacy.load("en_core_web_sm")

from pymongo import MongoClient

# Пример набора «популярных навыков» (на ваше усмотрение)
COMMON_SKILLS = {
    # Языки программирования
    'python', 'java', 'c++', 'javascript', 'typescript', 'go', 'ruby', 'php', 'swift', 'kotlin',

    # Фреймворки и библиотеки
    'django', 'flask', 'fastapi', 'express', 'react', 'angular', 'vue', 'next.js', 'nuxt.js', 'tailwind', 'bootstrap',

    # Анализ данных и машинное обучение
    'nlp', 'machine learning', 'deep learning', 'data analysis', 'data visualization',
    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'matplotlib', 'seaborn',

    # DevOps и базы данных
    'sql', 'mysql', 'postgresql', 'mongodb', 'firebase', 'docker', 'kubernetes', 'aws', 'azure', 'git', 'linux',

    # Инструменты
    'jira', 'github', 'gitlab', 'bitbucket', 'vscode', 'jenkins', 'figma', 'notion',

    # Прочее
    'api', 'rest', 'graphql', 'ci/cd', 'scrum', 'agile', 'unit testing', 'tdd', 'oop', 'design patterns'
}


# Набор «ключевых слов» для ATS
ATS_KEYWORDS = {
    'teamwork', 'leadership', 'communication', 'problem-solving', 'critical thinking',
    'adaptability', 'time management', 'project management', 'creativity', 'initiative',
    'collaboration', 'attention to detail', 'organization', 'strategic planning',
    'customer service', 'conflict resolution', 'decision making', 'multitasking',
    'sql', 'python', 'data analysis', 'product management', 'self-motivation'
}

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return "\n".join(full_text)

def analyze_resume_text(file_path):
    # 1) Извлечь текст
    if file_path.lower().endswith('.pdf'):
        raw_text = extract_text_from_pdf(file_path)
    elif file_path.lower().endswith('.docx'):
        raw_text = extract_text_from_docx(file_path)
    else:
        raw_text = ""

    if not raw_text:
        raw_text = ""

    # 2) NLTK: токенизация
    nltk_tokens = nltk.word_tokenize(raw_text.lower())

    # 3) SpaCy: разбор текста (named entities и т.п.)
    doc = nlp(raw_text)

    # Извлечём навыки, упомянутые в тексте, наивно:
    # например, если слово из COMMON_SKILLS встречается в токенах
    found_skills = set()
    for token in nltk_tokens:
        if token in COMMON_SKILLS:
            found_skills.add(token)

    # 4) Определим, каких навыков не хватает (Skill Gaps)
    missing_skills = COMMON_SKILLS - found_skills

    # 5) Оптимизация ключевых слов (ATS)
    found_ats_keywords = ATS_KEYWORDS.intersection(nltk_tokens)
    missing_ats_keywords = ATS_KEYWORDS - found_ats_keywords

    # 6) Проверка «форматирования» (примерно)
    # Скажем, ищем слово "Education", "Experience", "Skills" как заголовки.
    formatting_suggestions = []
    headings_found = re.findall(r"(Education|Experience|Skills|Summary)", raw_text, re.IGNORECASE)
    # Если какой-то из разделов не найден, предложим добавить
    essential_headings = {"Education", "Experience", "Skills"}
    found_headings = {h.lower() for h in headings_found}
    missing_headings = {h.lower() for h in essential_headings} - found_headings
    if missing_headings:
        formatting_suggestions.append(f"Добавьте разделы: {', '.join(missing_headings)}")

    # 7) Собираем результат
    feedback = {
        "skill_gaps": list(missing_skills),
        "resume_formatting": formatting_suggestions,
        "ats_keywords_missing": list(missing_ats_keywords),
    }

    # Можем также добавить: рейтинг = кол-во найденных навыков / общее кол-во
    rating = round(len(found_skills) / max(1, len(COMMON_SKILLS)) * 5, 2)  # например, шкала от 0 до 5

    # Сформируем итог
    analysis_result = {
        "raw_text_excerpt": raw_text[:600],  # обрезаем для примера
        "found_skills": list(found_skills),
        "missing_skills": feedback["skill_gaps"],
        "formatting_suggestions": feedback["resume_formatting"],
        "missing_ats_keywords": feedback["ats_keywords_missing"],
        "rating": rating,
        "recommendations": [
            "Заполните пропущенные навыки, если они действительно вам свойственны",
            "Добавьте чёткие разделы (Education, Experience, Skills)",
            "Добавьте недостающие ATS-ключевые слова, чтобы улучшить рейтинг"
        ]
    }

    # 8) Сохраняем в MongoDB
    client = MongoClient("mongodb://127.0.0.1:27017/")
    db = client["resume_mongo_db"]
    collection = db["resume_analysis"]

    inserted_id = collection.insert_one(analysis_result).inserted_id

    return str(inserted_id)
