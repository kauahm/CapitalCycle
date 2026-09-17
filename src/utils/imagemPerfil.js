// Processamento da foto de perfil — Fase 5A.
//
// A foto é preparada inteiramente no navegador e gravada como Data URL no
// próprio documento do usuário, sem Firebase Storage. Por isso o tamanho
// final importa: o documento é relido a cada troca de sessão, então a imagem
// precisa ser pequena de verdade.

/** Lado do quadrado final, em pixels. */
export const LADO_PX = 128;

/**
 * Teto do que é gravado no Firestore, em bytes da Data URL — não do arquivo
 * original. Base64 infla o conteúdo em cerca de um terço, então medir o
 * arquivo de entrada daria um número menor que o real.
 */
export const LIMITE_BYTES = 80 * 1024;

/**
 * Formatos raster aceitos. SVG fica de fora de propósito: é markup executável,
 * e não há motivo para processá-lo aqui.
 */
export const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];

// Qualidades tentadas em ordem decrescente. Lista fixa: garante que a busca
// termina, em vez de um laço que reduz a qualidade indefinidamente.
const QUALIDADES = [0.82, 0.72, 0.62, 0.52, 0.42];

/** Carrega o arquivo como <img>, resolvendo só quando o bitmap está pronto. */
function carregarImagem(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      // Chega aqui quando o conteúdo não é uma imagem de verdade, mesmo que o
      // nome ou o tipo declarado digam o contrário.
      reject(new Error('ARQUIVO_INVALIDO'));
    };
    img.src = url;
  });
}

/**
 * Converte o arquivo escolhido em uma Data URL quadrada, pequena e pronta
 * para gravar.
 *
 * O recorte é "cover" centralizado: pega o maior quadrado que cabe no centro
 * da imagem e o desenha no canvas. A proporção é preservada — o que sobra nas
 * bordas do lado mais longo é descartado, sem esticar nada.
 *
 * @param {File} file
 * @returns {Promise<{ dataUrl: string, bytes: number, qualidade: number }>}
 * @throws {Error} com `message` em: TIPO_NAO_SUPORTADO | ARQUIVO_INVALIDO | MUITO_GRANDE
 */
export async function prepararFotoPerfil(file) {
  if (!file || !TIPOS_ACEITOS.includes(file.type)) {
    throw new Error('TIPO_NAO_SUPORTADO');
  }

  const img = await carregarImagem(file);

  if (!img.width || !img.height) {
    throw new Error('ARQUIVO_INVALIDO');
  }

  const lado = Math.min(img.width, img.height);
  const sx = (img.width - lado) / 2;
  const sy = (img.height - lado) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = LADO_PX;
  canvas.height = LADO_PX;

  const ctx = canvas.getContext('2d');
  // Fundo branco: PNG e WebP podem ter transparência, e JPEG não a suporta —
  // sem isso as áreas transparentes sairiam pretas.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, LADO_PX, LADO_PX);
  ctx.drawImage(img, sx, sy, lado, lado, 0, 0, LADO_PX, LADO_PX);

  for (const qualidade of QUALIDADES) {
    const dataUrl = canvas.toDataURL('image/jpeg', qualidade);
    if (dataUrl.length <= LIMITE_BYTES) {
      return { dataUrl, bytes: dataUrl.length, qualidade };
    }
  }

  // Com 128×128 isso é praticamente inalcançável, mas se acontecer é melhor
  // recusar do que gravar um documento pesado demais.
  throw new Error('MUITO_GRANDE');
}

/** Mensagem de produto para cada falha do processamento. */
export function mensagemErroFoto(codigo) {
  switch (codigo) {
    case 'TIPO_NAO_SUPORTADO':
      return 'Escolha uma imagem JPG, PNG ou WebP.';
    case 'ARQUIVO_INVALIDO':
      return 'Não foi possível ler esta imagem. Tente outro arquivo.';
    case 'MUITO_GRANDE':
      return 'Não foi possível comprimir esta imagem o suficiente. Tente outra.';
    default:
      return 'Não foi possível atualizar a foto. Tente novamente.';
  }
}
