const mongoose = require('mongoose');
const Idioma = require('./models/idioma');
const Traduccion = require('./models/traduccion');

// Conexión a MongoDB (usar la misma configuración que el servidor)
const mongoUri = 'mongodb+srv://Anderson:20010113@practicbd.yolfa87.mongodb.net/?retryWrites=true&w=majority&appName=PracticBD';

async function inicializarIdiomas() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Conectado a MongoDB');

        // Idiomas base
        const idiomasBase = [
            {
                codigo: 'es',
                nombre: 'Español',
                nombreNativo: 'Español',
                bandera: '🇪🇸',
                predeterminado: true,
                activo: true
            },
            {
                codigo: 'en',
                nombre: 'English',
                nombreNativo: 'English',
                bandera: '🇺🇸',
                predeterminado: false,
                activo: true
            },
            {
                codigo: 'pt',
                nombre: 'Português',
                nombreNativo: 'Português',
                bandera: '🇵🇹',
                predeterminado: false,
                activo: true
            },
            {
                codigo: 'fr',
                nombre: 'Français',
                nombreNativo: 'Français',
                bandera: '🇫🇷',
                predeterminado: false,
                activo: true
            }
        ];

        // Insertar idiomas si no existen
        for (const idioma of idiomasBase) {
            const existe = await Idioma.findOne({ codigo: idioma.codigo });
            if (!existe) {
                await new Idioma(idioma).save();
                console.log(`Idioma ${idioma.nombre} creado`);
            } else {
                console.log(`Idioma ${idioma.nombre} ya existe`);
            }
        }

        // Crear traducciones base para cada idioma
        await crearTraduccionesBase();

        console.log('Inicialización de idiomas completada');
    } catch (error) {
        console.error('Error al inicializar idiomas:', error);
    } finally {
        await mongoose.disconnect();
    }
}

async function crearTraduccionesBase() {
    const traducciones = {
        'es': {
            'app.title': 'Catálogo de Productos',
            'nav.home': 'Inicio',
            'nav.products': 'Productos',
            'nav.about': 'Acerca de',
            'nav.contact': 'Contacto',
            'nav.login': 'Iniciar Sesión',
            'nav.register': 'Registrarse',
            'nav.cart': 'Mi carrito',
            'nav.profile': 'Perfil',
            'nav.preferences': 'Preferencias',
            'nav.faq': 'Preguntas y respuestas',
            'nav.terms': 'Términos y Condiciones',
            'btn.save': 'Guardar',
            'btn.cancel': 'Cancelar',
            'btn.delete': 'Eliminar',
            'btn.edit': 'Editar',
            'btn.add': 'Agregar',
            'btn.buy': 'Comprar',
            'btn.search': 'Buscar',
            'form.email': 'Correo electrónico',
            'form.password': 'Contraseña',
            'form.name': 'Nombre',
            'form.surname': 'Apellido',
            'form.phone': 'Teléfono',
            'form.description': 'Descripción',
            'pref.theme': 'Selecciona tu tema:',
            'pref.language': 'Selecciona tu idioma:',
            'pref.currency': 'Selecciona tu moneda:',
            'theme.light': '🌞 Claro',
            'theme.dark': '🌙 Oscuro',
            'theme.blue': '🌊 Azul',
            'theme.green': '🌿 Verde'
        },
        'en': {
            'app.title': 'Product Catalog',
            'nav.home': 'Home',
            'nav.products': 'Products',
            'nav.about': 'About',
            'nav.contact': 'Contact',
            'nav.login': 'Login',
            'nav.register': 'Register',
            'nav.cart': 'My cart',
            'nav.profile': 'Profile',
            'nav.preferences': 'Preferences',
            'nav.faq': 'FAQ',
            'nav.terms': 'Terms and Conditions',
            'btn.save': 'Save',
            'btn.cancel': 'Cancel',
            'btn.delete': 'Delete',
            'btn.edit': 'Edit',
            'btn.add': 'Add',
            'btn.buy': 'Buy',
            'btn.search': 'Search',
            'form.email': 'Email',
            'form.password': 'Password',
            'form.name': 'Name',
            'form.surname': 'Last Name',
            'form.phone': 'Phone',
            'form.description': 'Description',
            'pref.theme': 'Select your theme:',
            'pref.language': 'Select your language:',
            'pref.currency': 'Select your currency:',
            'theme.light': '🌞 Light',
            'theme.dark': '🌙 Dark',
            'theme.blue': '🌊 Blue',
            'theme.green': '🌿 Green'
        },
        'pt': {
            'app.title': 'Catálogo de Produtos',
            'nav.home': 'Início',
            'nav.products': 'Produtos',
            'nav.about': 'Sobre',
            'nav.contact': 'Contato',
            'nav.login': 'Entrar',
            'nav.register': 'Registrar',
            'nav.cart': 'Meu carrinho',
            'nav.profile': 'Perfil',
            'nav.preferences': 'Preferências',
            'nav.faq': 'Perguntas e respostas',
            'nav.terms': 'Termos e Condições',
            'btn.save': 'Salvar',
            'btn.cancel': 'Cancelar',
            'btn.delete': 'Excluir',
            'btn.edit': 'Editar',
            'btn.add': 'Adicionar',
            'btn.buy': 'Comprar',
            'btn.search': 'Buscar',
            'form.email': 'E-mail',
            'form.password': 'Senha',
            'form.name': 'Nome',
            'form.surname': 'Sobrenome',
            'form.phone': 'Telefone',
            'form.description': 'Descrição',
            'pref.theme': 'Selecione seu tema:',
            'pref.language': 'Selecione seu idioma:',
            'pref.currency': 'Selecione sua moeda:',
            'theme.light': '🌞 Claro',
            'theme.dark': '🌙 Escuro',
            'theme.blue': '🌊 Azul',
            'theme.green': '🌿 Verde'
        },
        'fr': {
            'app.title': 'Catalogue de Produits',
            'nav.home': 'Accueil',
            'nav.products': 'Produits',
            'nav.about': 'À propos',
            'nav.contact': 'Contact',
            'nav.login': 'Se connecter',
            'nav.register': "S'inscrire",
            'nav.cart': 'Mon panier',
            'nav.profile': 'Profil',
            'nav.preferences': 'Préférences',
            'nav.faq': 'Questions fréquentes',
            'nav.terms': 'Conditions générales',
            'btn.save': 'Sauvegarder',
            'btn.cancel': 'Annuler',
            'btn.delete': 'Supprimer',
            'btn.edit': 'Modifier',
            'btn.add': 'Ajouter',
            'btn.buy': 'Acheter',
            'btn.search': 'Rechercher',
            'form.email': 'E-mail',
            'form.password': 'Mot de passe',
            'form.name': 'Nom',
            'form.surname': 'Prénom',
            'form.phone': 'Téléphone',
            'form.description': 'Description',
            'pref.theme': 'Sélectionnez votre thème:',
            'pref.language': 'Sélectionnez votre langue:',
            'pref.currency': 'Sélectionnez votre devise:',
            'theme.light': '🌞 Clair',
            'theme.dark': '🌙 Sombre',
            'theme.blue': '🌊 Bleu',
            'theme.green': '🌿 Vert'
        }
    };

    for (const [idioma, textos] of Object.entries(traducciones)) {
        for (const [clave, texto] of Object.entries(textos)) {
            const existe = await Traduccion.findOne({ clave, idioma });
            if (!existe) {
                await new Traduccion({ clave, idioma, texto }).save();
            }
        }
        console.log(`Traducciones para ${idioma} creadas`);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    inicializarIdiomas();
}

module.exports = { inicializarIdiomas };
