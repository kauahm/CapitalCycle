import os
import zipfile

# Nome do arquivo ZIP de saída
zip_nome = "projeto_tcc.zip"

# Pastas e arquivos que devem ser ignorados
ignorados = {"node_modules", ".git", "dist", "build", "__pycache__", ".vscode", zip_nome}

with zipfile.ZipFile(zip_nome, "w", zipfile.ZIP_DEFLATED) as zipf:
    for raiz, dirs, arquivos in os.walk("."):
        # Modifica a lista 'dirs' in-place para que o os.walk ignore as pastas indesejadas
        dirs[:] = [d for d in dirs if d not in ignorados]
        
        for arquivo in arquivos:
            caminho_completo = os.path.join(raiz, arquivo)
            # Ignora o próprio script se ele estiver na raiz
            if arquivo == "compactar.py":
                continue
            zipf.write(caminho_completo, os.path.relpath(caminho_completo, "."))

print(f"Projeto compactado com sucesso em '{zip_nome}'!")