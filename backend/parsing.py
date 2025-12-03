import re
import uuid
import random

PHONE_RE = re.compile(r'[\d\-\+\s\(\)]{6,}')

def normalize_phone_digits(s, default_cc='55'):
    """Normaliza telefone para formato E.164 sem '+'"""
    digits = re.sub(r'\D', '', s or '')

    if len(digits) >= 11 and digits.startswith(default_cc):
        return digits
    if len(digits) in (10, 11):
        return default_cc + digits
    if len(digits) <= 9:
        return default_cc + digits
    return digits

def parse_text(text, default_cc='55'):
    """Parseia texto colado e retorna lista de participantes"""
    lines = text.splitlines()
    participants = []
    group_name = None
    errors = []

    for idx, raw in enumerate(lines, 1):
        line = raw.strip()
        if not line:
            continue

        # Detecta header/título
        low = line.lower()
        if ('amigo' in low and 'secreto' in low) or \
           (line.count('-') >= 1 and len(line.split()) <= 6 and not re.search(r'\d', line)):
            group_name = line
            continue

        # Procura por padrão de telefone
        m = PHONE_RE.search(line)
        if not m:
            errors.append(f"Não foi possível detectar telefone na linha {idx}: '{line}'")
            continue

        phone_part = m.group(0)
        name_part = line[:m.start()].strip()

        if not name_part:
            # Fallback: tenta split por tab
            parts = re.split(r'\t+', line)
            if len(parts) >= 2:
                name_part = parts[0].strip()
                phone_part = parts[-1].strip()
            else:
                errors.append(f"Nome vazio na linha {idx}: '{line}'")
                continue

        phone_digits = normalize_phone_digits(phone_part, default_cc)
        participant = {
            "id": str(uuid.uuid4()),
            "name": name_part,
            "phone_raw": phone_part,
            "phone_digits": phone_digits,
            "is_phone_valid": len(re.sub(r'\D', '', phone_digits)) >= 8
        }
        participants.append(participant)

    return {
        "group_name": group_name,
        "participants": participants,
        "errors": errors
    }

def generate_pairs(participants):
    """Gera pares de um ciclo único (Fisher-Yates shuffle)"""
    n = len(participants)
    if n < 2:
        return {"pairs": [], "warnings": ["Necessita pelo menos 2 participantes"]}

    arr = participants.copy()
    random.shuffle(arr)
    pairs = []

    for i in range(n):
        giver = arr[i]
        receiver = arr[(i + 1) % n]
        pairs.append({
            "giver": giver,
            "receiver": receiver
        })

    return {"pairs": pairs, "warnings": []}
