import fetch from 'node-fetch';
import db from '../models/index.js';

const HOJA_MODELO_MAP = {
  categoria_skill: 'CategoriaSkill',
  skills: 'Skill',
  skill_categoria: 'SkillCategoria',
  servicios: 'Servicio',
  proyectos: 'Proyecto',
  imagenes: 'Imagen',
  proyecto_skill: 'ProyectoSkill',
  proyecto_servicio: 'ProyectoServicio',
  testimonios: 'Testimonio',
  articulos: 'Articulo',
  settings: 'Settings',
};

export const importarDesdeSheet = async (urlSheet, hojasSolicitadas = null) => {
  const response = await fetch(urlSheet);
  if (!response.ok) throw new Error(`Error al hacer fetch del Sheet (${response.status})`);

  const data = await response.json();

  const hojasAImportar = hojasSolicitadas?.length
    ? hojasSolicitadas
    : Object.keys(HOJA_MODELO_MAP);

  const logImportaciones = [];

  for (const hoja of hojasAImportar) {
    const modelo = HOJA_MODELO_MAP[hoja];
    if (!modelo) {
      logImportaciones.push({ hoja, status: '❌ modelo no encontrado' });
      continue;
    }

    const registros = data[hoja];
    if (!registros || !Array.isArray(registros)) {
      logImportaciones.push({ hoja, status: '⚠️ sin datos o formato incorrecto' });
      continue;
    }

    await db[modelo].destroy({ where: {}, truncate: true });

    if (registros.length > 0) {
      await db[modelo].bulkCreate(registros);
      logImportaciones.push({ hoja, status: `✅ ${registros.length} registros importados` });
    } else {
      logImportaciones.push({ hoja, status: '⚠️ sin registros para importar' });
    }
  }

  return logImportaciones;
};
