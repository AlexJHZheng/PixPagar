export default {
  route: {
    dashboard: 'Dashboard',
    pix: 'Gerar Pix',
    payflow: 'Fluxo de Pagamento',
    paycount: 'Recebimento loja',
    shopcount: 'Recebimento loja geral'
  },
  dashboard: {
    pixrecive: 'Sistema Central de Recebimento Pix',
    com1: '1. Este sistema é um sistema central de recebimento, utilizado para receber e processar de forma unificada as solicitações de pagamento de vários sistemas de negócios.',
    com2: '2. Este sistema permite consultas instantâneas, facilitando a verificação do status de recebimento e evitando fraudes com comprovantes falsos.',
    com3: '3. Este sistema realiza a conciliação automática, resumindo automaticamente o total de transações diárias, tornando o processo prático e rápido.',
    com4: '4. Este sistema facilita o processo de recebimento para os comerciantes, dispersa os riscos e reduz os riscos fiscais e financeiros do estabelecimento.'
  },
  navbar: {
    logOut: 'Salir',
    dashboard: 'Panel de control',
    github: 'Github',
    theme: 'Tema',
    size: 'Tamaño global',
    profile: 'Profile'
  },
  pix: {
    painel: 'PIX Caixa',
    pedido: 'Número do pedido',
    client: 'Cliente',
    obs: 'Obs',
    valor: 'Valor',
    geraqr: 'Gerar código de pagamento',
    notice: 'Aviso',
    comformvalor: 'Confirme que o valor do pagamento é',
    comfirm: 'Confirmar',
    cancel: 'Cancelar',
    reciveclean: 'Pagamento bem-sucedido, clique em OK para limpar a tela',
    notrecive:
      'O pagamento ainda não foi recebido, por favor, consulte novamente',
    min10: '10 minutos',
    min30: '30 minutos',
    hora4: '4 horas',
    hora12: '12 horas',
    query: 'Consultar pagamento',
    clean: 'Limpar',
    newquery: 'Gerar nova cobrança',
    errorvalor: 'Por favor, insira um valor correto'
  },
  flow: {
    timerange: 'Periodo',
    to: 'até',
    starttime: 'Hora de início',
    endtime: 'Hora de término',
    query: 'Consultar',
    codico: 'Código',
    date: 'Data',
    shop: 'Loja',
    client: 'Cliente',
    summary: 'Obs',
    status: 'Status',
    operar: 'Operar',
    recived: 'Pago',
    notrecive: 'Não pago',
    parcel: 'Pagamento parcial',
    cancel: 'Cancelar',
    return: 'Retornar',
    experid: 'Expirado',
    qrcode: 'QR Code',
    delete: 'Excluir'
  },
  paycount: {
    custom: 'Personalizado',
    today: 'Hoje',
    yesterday: 'Ontem',
    last7: 'Últimos 7 dias',
    last30: 'Últimos 30 dias',
    total: 'Total'
  },
  login: {
    title: 'Formulario de acceso',
    logIn: 'Acceso',
    username: 'Usuario',
    password: 'Contraseña',
    any: 'nada',
    thirdparty: 'Conectar con',
    thirdpartyTips:
      'No se puede simular en local, así que combine su propia simulación de negocios. ! !'
  },
  documentation: {
    documentation: 'Documentación',
    github: 'Repositorio Github'
  },
  permission: {
    addRole: 'Nuevo rol',
    editPermission: 'Permiso de edición',
    roles: 'Tus permisos',
    switchRoles: 'Cambiar permisos',
    tips: 'In some cases it is not suitable to use v-permission, such as element Tab component or el-table-column and other asynchronous rendering dom cases which can only be achieved by manually setting the v-if.',
    delete: 'Borrar',
    confirm: 'Confirmar',
    cancel: 'Cancelar'
  },
  guide: {
    description:
      'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Ver guía'
  },
  components: {
    documentation: 'Documentación',
    tinymceTips:
      'Rich text editor is a core part of management system, but at the same time is a place with lots of problems. In the process of selecting rich texts, I also walked a lot of detours. The common rich text editors in the market are basically used, and the finally chose Tinymce. See documentation for more detailed rich text editor comparisons and introductions.',
    dropzoneTips:
      'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
    stickyTips:
      'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1:
      'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2:
      'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips:
      'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'Orden por defecto',
    dragTips2: 'The after dragging order',
    title: 'Título',
    importance: 'Importancia',
    type: 'Tipo',
    remark: 'Remark',
    search: 'Buscar',
    add: 'Añadir',
    export: 'Exportar',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Fecha',
    author: 'Autor',
    readings: 'Lector',
    status: 'Estado',
    actions: 'Acciones',
    edit: 'Editar',
    publish: 'Publicar',
    draft: 'Draft',
    delete: 'Eliminar',
    cancel: 'Cancelar',
    confirm: 'Confirmar'
  },
  example: {
    warning:
      'Creating and editing pages cannot be cached by keep-alive because keep-alive include does not currently support caching based on routes, so it is currently cached based on component name. If you want to achieve a similar caching effect, you can use a browser caching scheme such as localStorage. Or do not use keep-alive include to cache all pages directly. See details'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description:
      'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Documento de introducción'
  },
  excel: {
    export: 'Exportar',
    selectedExport: 'Exportar seleccionados',
    placeholder: 'Por favor escribe un nombre de fichero'
  },
  zip: {
    export: 'Exportar',
    placeholder: 'Por favor escribe un nombre de fichero'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading pdf.'
  },
  theme: {
    change: 'Cambiar tema',
    documentation: 'Documentación del tema',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Actualizar',
    close: 'Cerrar',
    closeOthers: 'Cerrar otros',
    closeAll: 'Cerrar todos'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  }
}