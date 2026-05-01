#!/bin/bash

# Script para copiar el contenido relevante de ProSkills al portapapeles (Mac)

TARGET_DIR="./ProSkills"
OUTPUT_FILE="./scripts/proskills_content.txt"

# Asegurarse de estar en la raíz del proyecto si se ejecuta desde la carpeta scripts
if [[ "$PWD" == */scripts ]]; then
    cd ..
fi

echo "📄 Recopilando contenido técnico de $TARGET_DIR..."
echo "⚠️  Omitiendo archivos binarios, node_modules y carpetas de control."

# Limpiar archivo de salida
> "$OUTPUT_FILE"

# Buscar y concatenar archivos de texto relevantes
find "$TARGET_DIR" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.scss" -o -name "*.html" -o -name "*.md" -o -name "*.json" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/build/*" \
  -not -path "*/.DS_Store" | while read -r file; do
    echo "--- INICIO DE ARCHIVO: $file ---" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo -e "\n--- FIN DE ARCHIVO: $file ---\n\n" >> "$OUTPUT_FILE"
done

# Copiar al portapapeles (Solo funciona en macOS con pbcopy)
if command -v pbcopy >/dev/null 2>&1; then
    cat "$OUTPUT_FILE" | pbcopy
    echo "✅ ¡Todo el contenido ha sido copiado al portapapeles!"
else
    echo "❌ No se encontró 'pbcopy'. El contenido se guardó en $OUTPUT_FILE"
fi

echo "📍 Puedes revisar el resultado en: $OUTPUT_FILE"
