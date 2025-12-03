import sys
from parsing import parse_text, generate_pairs, normalize_phone_digits

def test_normalize_phone():
    """Testa normalização de telefones"""
    # Teste 1: telefone com DDD + número (11 dígitos)
    result = normalize_phone_digits('11 91234-5678')
    assert result == '5511912345678'

    # Teste 2: telefone com código de país no início
    assert normalize_phone_digits('5511912345678') == '5511912345678'

    # Teste 3: telefone curto (apenas dígitos)
    result = normalize_phone_digits('91234-5678')
    assert result.startswith('55')

    print("✓ Testes de normalização passou")

def test_parse_basic():
    """Testa parsing básico"""
    text = """Amigo Secreto - Empresa XYZ
João Silva\t11 91234-5678
Maria Santos\t21 98765-4321
Pedro Oliveira\t31 99876-5432"""

    result = parse_text(text, '55')

    assert result['group_name'] == 'Amigo Secreto - Empresa XYZ'
    assert len(result['participants']) == 3
    assert result['participants'][0]['name'] == 'João Silva'
    assert result['participants'][0]['is_phone_valid']

    print("✓ Teste de parsing básico passou")

def test_parse_with_errors():
    """Testa parsing com linhas inválidas"""
    text = """Amigo Secreto
João Silva\t11 98765-4321
Maria da Silva
Pedro\t"""

    result = parse_text(text, '55')

    # Deve ter 2 participantes válidos
    assert len(result['participants']) == 1
    # Deve ter erros
    assert len(result['errors']) > 0

    print("✓ Teste de parsing com erros passou")

def test_generate_pairs():
    """Testa geração de pares"""
    participants = [
        {'id': '1', 'name': 'João', 'phone_digits': '5511987654321', 'is_phone_valid': True},
        {'id': '2', 'name': 'Maria', 'phone_digits': '5511987654322', 'is_phone_valid': True},
        {'id': '3', 'name': 'Pedro', 'phone_digits': '5511987654323', 'is_phone_valid': True},
    ]

    result = generate_pairs(participants)
    pairs = result['pairs']

    # Deve ter 3 pares
    assert len(pairs) == 3

    # Cada participante deve aparecer exatamente uma vez como giver
    givers = [p['giver']['id'] for p in pairs]
    assert len(givers) == 3
    assert len(set(givers)) == 3  # Sem duplicatas

    # Cada participante deve aparecer exatamente uma vez como receiver
    receivers = [p['receiver']['id'] for p in pairs]
    assert len(receivers) == 3
    assert len(set(receivers)) == 3

    # Ninguém deve tirar a si mesmo
    for pair in pairs:
        assert pair['giver']['id'] != pair['receiver']['id']

    print("✓ Teste de geração de pares passou")

def test_generate_pairs_less_than_2():
    """Testa geração com menos de 2 participantes"""
    result = generate_pairs([])

    assert len(result['pairs']) == 0
    assert len(result['warnings']) > 0

    print("✓ Teste com menos de 2 participantes passou")

if __name__ == '__main__':
    try:
        test_normalize_phone()
        test_parse_basic()
        test_parse_with_errors()
        test_generate_pairs()
        test_generate_pairs_less_than_2()
        print("\n✅ Todos os testes passaram!")
    except AssertionError as e:
        print(f"\n❌ Teste falhou: {e}")
        sys.exit(1)
