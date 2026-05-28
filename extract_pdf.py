import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from PyPDF2 import PdfReader

reader = PdfReader(r"C:\Users\shiva\Downloads\SoloLeveling_TrainingSystem_Blueprint.pdf")
full_text = ""
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text:
        full_text += f"\n{'='*60}\nPAGE {i+1}\n{'='*60}\n{text}\n"

# Write to file so we can read it completely
with open("blueprint_text.txt", "w", encoding="utf-8") as f:
    f.write(full_text)

print("Done! Written to blueprint_text.txt")
print(f"Total pages: {len(reader.pages)}")
print(f"Total characters: {len(full_text)}")
