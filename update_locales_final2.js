const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'frontend', 'src', 'locales');
const languages = ['en', 'es', 'pt'];

const newKeys = {
    "imgAlt": {
        "emailConfirmation": {
            "en": "Email Confirmation",
            "es": "Confirmación de Email",
            "pt": "Confirmação de e-mail"
        },
        "forgotPassword": {
            "en": "Forgot Password",
            "es": "Contraseña Olvidada",
            "pt": "Esqueceu a senha"
        },
        "login": {
            "en": "Login",
            "es": "Iniciar Sesión",
            "pt": "Entrar"
        },
        "register": {
            "en": "Register",
            "es": "Registrarse",
            "pt": "Registrar"
        },
        "resetPassword": {
            "en": "Reset Password",
            "es": "Restablecer Contraseña",
            "pt": "Redefinir Senha"
        },
        "profile": {
            "en": "Profile Default",
            "es": "Perfil",
            "pt": "Perfil"
        }
    },
    "editServiceModal": {
        "title": {
            "en": "Edit Service",
            "es": "Editar Servicio",
            "pt": "Editar Serviço"
        },
        "serviceName": {
            "en": "Service Name",
            "es": "Nombre del servicio",
            "pt": "Nome do Serviço"
        },
        "description": {
            "en": "Description",
            "es": "Descripción",
            "pt": "Descrição"
        },
        "price": {
            "en": "Price",
            "es": "Precio",
            "pt": "Preço"
        },
        "coverImage": {
            "en": "Service Image (Cover)",
            "es": "Imagen del servicio (portada)",
            "pt": "Imagem do Serviço (Capa)"
        },
        "currentCover": {
            "en": "Cover",
            "es": "Portada",
            "pt": "Capa"
        },
        "save": {
            "en": "Save",
            "es": "Guardar",
            "pt": "Salvar"
        }
    },
    "dropdownActions": {
        "assignSkill": {
            "en": "Assign Skill",
            "es": "Asignar Skill",
            "pt": "Atribuir Skill"
        },
        "assignServices": {
            "en": "Assign Services",
            "es": "Asignar Servicios",
            "pt": "Atribuir Serviços"
        },
        "editProject": {
            "en": "Edit Project",
            "es": "Editar Proyecto",
            "pt": "Editar Projeto"
        },
        "deleteProject": {
            "en": "Delete Project",
            "es": "Eliminar Proyecto",
            "pt": "Excluir Projeto"
        }
    },
    "footer": {
        "copyright": {
            "en": "© Enzo Pinotti - All rights reserved",
            "es": "© Enzo Pinotti - Todos los derechos reservados",
            "pt": "© Enzo Pinotti - Todos os direitos reservados"
        }
    },
    "header": {
        "myProfile": {
            "en": "My Profile",
            "es": "Mi Perfil",
            "pt": "Meu Perfil"
        },
        "adminPanel": {
            "en": "Admin Panel",
            "es": "Admin Panel",
            "pt": "Painel Administrador"
        },
        "logout": {
            "en": "Log out",
            "es": "Cerrar Sesión",
            "pt": "Sair"
        }
    }
};

const extraProfileKeys = {
    "imageTooLarge": {
        "en": "The image is too large. Maximum size is 10MB.",
        "es": "La imagen es demasiado grande. El tamaño máximo es de 10MB.",
        "pt": "A imagem é muito grande. O tamanho máximo é de 10 MB."
    },
    "avatarUpdated": {
        "en": "Avatar updated successfully",
        "es": "Avatar actualizado correctamente",
        "pt": "Avatar atualizado com sucesso"
    },
    "avatarUpdateError": {
        "en": "Error updating avatar",
        "es": "Error al actualizar avatar",
        "pt": "Erro ao atualizar avatar"
    },
    "avatarDeleted": {
        "en": "Profile picture deleted",
        "es": "Se eliminó la foto de perfil",
        "pt": "Foto de perfil excluída"
    },
    "avatarDeleteError": {
        "en": "Error deleting avatar",
        "es": "Error al eliminar avatar",
        "pt": "Erro ao excluir avatar"
    },
    "updated": {
        "en": "Profile updated successfully",
        "es": "Perfil actualizado correctamente",
        "pt": "Perfil atualizado com sucesso"
    },
    "editAvatar": {
        "en": "Edit",
        "es": "Editar",
        "pt": "Editar"
    },
    "loading": {
        "en": "Uploading...",
        "es": "Subiendo...",
        "pt": "Completando..."
    },
    "saveAvatar": {
        "en": "Save Avatar",
        "es": "Guardar Avatar",
        "pt": "Salvar Avatar"
    },
    "deleteAvatar": {
        "en": "Delete photo",
        "es": "Eliminar foto",
        "pt": "Excluir foto"
    },
    "save": {
        "en": "Save changes",
        "es": "Guardar cambios",
        "pt": "Salvar as alterações"
    }
};

const extraAdminKeys = {
    "coverImage": {
        "en": "Cover Image",
        "es": "Imagen Pastilla (portada)",
        "pt": "Imagem de Capa"
    },
    "newCover": {
        "en": "New Cover",
        "es": "Nueva Portada",
        "pt": "Nova Capa"
    },
    "currentCover": {
        "en": "Current Cover",
        "es": "Portada Actual BD",
        "pt": "Capa Atual"
    },
    "extraImages": {
        "en": "Extra Images (max 5)",
        "es": "Imágenes Extras (máx 5)",
        "pt": "Imagens Extras (máx. 5)"
    },
    "dbImage": {
        "en": "DB Image",
        "es": "Imagen BD",
        "pt": "Imagem BD"
    }
};

languages.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    let content = {};
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        content = JSON.parse(raw);
    } catch (err) {
        console.error(`Error reading ${lang}:`, err);
        return;
    }

    // Iterate top-level sections
    for (const [section, keys] of Object.entries(newKeys)) {
        if (!content[section]) {
            content[section] = {};
        }
        for (const [key, value] of Object.entries(keys)) {
            content[section][key] = value[lang];
        }
    }

    // Inject additional profile keys
    if (!content['profile']) content['profile'] = {};
    for (const [key, value] of Object.entries(extraProfileKeys)) {
        content['profile'][key] = value[lang];
    }

    // Inject additional admin keys
    if (!content['adminProjectForm']) content['adminProjectForm'] = {};
    for (const [key, value] of Object.entries(extraAdminKeys)) {
        content['adminProjectForm'][key] = value[lang];
    }

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Updated ${lang}.json`);
});
