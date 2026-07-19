# PTKP Content Manager

## Install

```bash
python -m venv .venv

source .venv/bin/activate
```

Windows

```powershell
.venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

## Usage

```bash
python content.py
```

The tool will:

- Ask for the content type
- Collect metadata
- Generate the slug
- Create the MDX file
- Save it in the correct content collection
