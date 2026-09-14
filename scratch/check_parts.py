import sys

def main():
    for part in range(1, 5):
        filename = f'scratch/import_part{part}.sql'
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        print(f'Part {part} length: {len(content)} bytes')

if __name__ == '__main__':
    main()
