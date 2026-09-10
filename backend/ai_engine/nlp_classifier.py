import sys
import json
import re

def compute_priority_score(deadline_hours, attendance_percentage, max_marks):
    """
    Python ML Priority Score calculation algorithm
    """
    deadline_factor = max(0, min(100, (168 - deadline_hours) / 168 * 100)) if deadline_hours else 50
    
    # Attendance risk shortfall factor
    attendance_shortfall = max(0, 75.0 - attendance_percentage) if attendance_percentage else 0
    attendance_factor = min(100, attendance_shortfall * 10)
    
    academic_factor = min(100, (max_marks / 100) * 100) if max_marks else 50
    
    score = (deadline_factor * 0.40) + (attendance_factor * 0.35) + (academic_factor * 0.25)
    return round(score, 1)

def classify_notice_nlp(text):
    """
    NLP Keyword extraction and category classification
    """
    tags = []
    text_lower = text.lower()
    
    if any(k in text_lower for k in ["attendance", "debarment", "medical", "shortage"]):
        tags.append("NLP: Academic Risk")
    if any(k in text_lower for k in ["placement", "hiring", "sde", "package", "lpa"]):
        tags.append("NLP: Placement Drive")
    if any(k in text_lower for k in ["exam", "hall ticket", "mid-term", "seating"]):
        tags.append("NLP: Exam Schedule")
    if any(k in text_lower for k in ["mandatory", "urgent", "deadline", "registrar"]):
        tags.append("NLP: Mandatory Action")
    if any(k in text_lower for k in ["hackathon", "workshop", "fest", "codechef"]):
        tags.append("NLP: Campus Life")

    if not tags:
        tags.append("NLP: General Circular")

    return tags

if __name__ == "__main__":
    if len(sys.argv) > 1:
        mode = sys.argv[1]
        if mode == "score" and len(sys.argv) >= 5:
            hours = float(sys.argv[2])
            att = float(sys.argv[3])
            marks = float(sys.argv[4])
            print(json.dumps({"priorityScore": compute_priority_score(hours, att, marks)}))
        elif mode == "classify" and len(sys.argv) >= 3:
            notice_text = sys.argv[2]
            print(json.dumps({"nlpTags": classify_notice_nlp(notice_text)}))
        else:
            print(json.dumps({"status": "AI Engine Active"}))
    else:
        print(json.dumps({"status": "CampusFlow Python NLP Classifier v1.0"}))
