import {
  CAROUSEL,
  CATEGORIES,
  CONTENT_BLOCKS,
  DEMO_TOKEN,
  PRODUCTS,
  SPECS,
} from './data';
import { resetDemoState } from './store';

export class DemoHttpError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nextId(state, prefix) {
  state.seq = (state.seq || 100) + 1;
  return `${prefix}-${state.seq}`;
}

function findProduct(id) {
  return PRODUCTS.find((product) => product.id === String(id));
}

function findCompany(state, id) {
  const company = state.companies.find((item) => item.id === String(id));
  if (!company) {
    throw new DemoHttpError('Entreprise introuvable', 404);
  }
  return company;
}

function makeCartItem(state, product, quantity) {
  return {
    id: nextId(state, 'ci'),
    productId: product.id,
    quantity,
    price: product.price,
    title: product.title,
    product: {
      id: product.id,
      title: product.title,
      image: product.image,
    },
  };
}

function listParam(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return String(value)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function queryArticles(params) {
  let list = PRODUCTS.slice();
  const ids = listParam(params.ids);
  if (ids.length) {
    list = list.filter((article) => ids.includes(article.id));
  }

  const category = params.category;
  if (category && category !== 'Tous') {
    list = list.filter(
      (article) =>
        article.category === category ||
        article.categoryObj?.id === category ||
        article.categoryObj?.name === category
    );
  }

  const search = params.search || params.q;
  if (search) {
    const needle = String(search).toLowerCase();
    list = list.filter((article) => {
      const haystack = `${article.title} ${article.description} ${article.category}`.toLowerCase();
      return haystack.includes(needle);
    });
  }

  const specIds = listParam(params.specifications);
  if (specIds.length) {
    list = list.filter((article) => {
      const articleSpecIds = (article.specifications || []).map(
        (spec) => spec.technicalSpecificationId
      );
      return specIds.every((id) => articleSpecIds.includes(id));
    });
  }

  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 10);
  const start = (page - 1) * limit;

  return {
    articles: clone(list.slice(start, start + limit)),
    total: list.length,
    page,
    limit,
  };
}

function placeOrder(state, companyId) {
  if (!state.cart.length) {
    throw new DemoHttpError('Panier vide', 400);
  }
  const company = companyId ? findCompany(state, companyId) : null;

  const items = state.cart.map((item) => ({
    quantity: item.quantity,
    article: {
      id: item.productId,
      title: item.title,
      image: item.product?.image,
      price: item.price,
    },
  }));
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const rounded = Math.round(total * 100) / 100;
  const date = new Date().toISOString();
  const order = {
    id: nextId(state, 'ord'),
    date,
    total: rounded,
    status: 'processing',
    items,
  };
  state.orders.unshift(order);

  if (company) {
    if (!Array.isArray(company.orders)) company.orders = [];
    company.orders.unshift({
      id: nextId(state, 'po'),
      description: items.map((item) => item.article.title).join(', '),
      date,
      status: 'pending',
      amount: rounded,
    });
  }

  state.cart = [];

  return {
    simulated: true,
    id: order.id,
    sessionId: `demo_${order.id}`,
    amount: rounded,
    message: "Paiement simulé. Stripe n'a pas été contacté.",
  };
}

function contentFor(pageLocation) {
  const location = pageLocation || 'homepage';
  return CONTENT_BLOCKS.filter((block) => !block.pageLocation || block.pageLocation === location);
}

export function dispatchDemoRequest(state, request) {
  const method = request.method;
  const path = request.path;
  const body = request.body || {};
  const params = request.params || {};

  if (method === 'GET' && path === '/articles') {
    return queryArticles(params);
  }

  if (method === 'GET' && path === '/articles/search') {
    return queryArticles({ ...params, q: params.q || params.search });
  }

  if (method === 'GET' && path.startsWith('/articles/')) {
    const id = decodeURIComponent(path.slice('/articles/'.length));
    const product = findProduct(id);
    if (!product) throw new DemoHttpError('Article introuvable', 404);
    return { article: clone(product) };
  }

  if (method === 'GET' && (path === '/public/categories' || path === '/categories')) {
    return clone(CATEGORIES);
  }

  if (method === 'GET' && path === '/public/carousel') {
    return clone(CAROUSEL);
  }

  if (method === 'GET' && path === '/public/content') {
    return clone(contentFor(params.pageLocation));
  }

  if (method === 'GET' && path === '/specifications') {
    return clone(SPECS);
  }

  if (method === 'GET' && path === '/cart') {
    return { items: clone(state.cart) };
  }

  if (method === 'POST' && path === '/cart') {
    const product = findProduct(body.productId);
    if (!product) throw new DemoHttpError('Produit introuvable', 404);
    const quantity = Math.max(1, Number(body.quantity) || 1);
    const existing = state.cart.find((item) => item.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push(makeCartItem(state, product, quantity));
    }
    return { items: clone(state.cart) };
  }

  if (method === 'PATCH' && path === '/cart') {
    const item = state.cart.find((entry) => entry.id === body.cartItemId);
    if (!item) throw new DemoHttpError('Article de panier introuvable', 404);
    item.quantity = Math.max(1, Number(body.quantity) || 1);
    return { items: clone(state.cart) };
  }

  if (method === 'DELETE' && path === '/cart') {
    state.cart = state.cart.filter((item) => item.id !== body.cartItemId);
    return { items: clone(state.cart) };
  }

  if (method === 'DELETE' && path === '/cart/clear') {
    state.cart = [];
    return { items: [] };
  }

  if (method === 'POST' && path === '/auth/login') {
    if (body.token) {
      return { token: DEMO_TOKEN, user: clone(state.user) };
    }
    return {
      success: true,
      message: "Aucun e-mail n'a été envoyé. La démo accepte n'importe quel code.",
    };
  }

  if (method === 'POST' && path === '/auth/register') {
    return {
      success: true,
      message: "Inscription simulée. Aucun compte n'a été créé sur le serveur.",
    };
  }

  if (method === 'POST' && path === '/auth/logout') {
    return { success: true };
  }

  if (method === 'POST' && path === '/auth/verify') {
    return { success: true, user: clone(state.user) };
  }

  if (method === 'POST' && path === '/auth/forgot-password') {
    return {
      success: true,
      message: "Aucun e-mail de réinitialisation n'a été envoyé.",
    };
  }

  if (method === 'GET' && path === '/user/profile') {
    return clone(state.user);
  }

  if (method === 'PUT' && path === '/user/profile') {
    ['name', 'phone', 'address', 'email'].forEach((key) => {
      if (body[key] !== undefined) state.user[key] = body[key];
    });
    return clone(state.user);
  }

  if (method === 'GET' && path === '/user/orders') {
    return { orders: clone(state.orders) };
  }

  if (method === 'DELETE' && path === '/user/delete-account') {
    resetDemoState();
    return { success: true, message: 'Compte démo réinitialisé sur cet appareil.' };
  }

  if (method === 'GET' && path === '/user/export-data') {
    return {
      exportedAt: new Date().toISOString(),
      notice: "Export fictif généré sur cet appareil. Aucune donnée n'a été envoyée.",
      user: clone(state.user),
      orders: clone(state.orders),
      consent: clone(state.consent),
      companies: clone(state.companies),
      cart: clone(state.cart),
    };
  }

  if (method === 'GET' && path === '/user/consent') {
    return clone(state.consent);
  }

  if (method === 'PUT' && path === '/user/consent') {
    const previous = state.consent.consent || {};
    const next = body.consent || {};
    const timestamp = new Date().toISOString();
    Object.keys(next).forEach((key) => {
      if (previous[key] !== next[key]) {
        state.consent.history.unshift({
          consentType: key,
          status: Boolean(next[key]),
          timestamp,
        });
      }
    });
    state.consent.consent = { ...previous, ...next };
    if (body.dataRetentionPeriod) {
      state.consent.dataRetentionPeriod = body.dataRetentionPeriod;
    }
    return clone(state.consent);
  }

  if (method === 'GET' && path === '/companies/invitations') {
    return { invitations: clone(state.invitations) };
  }

  const invitationAccept = path.match(/^\/companies\/invitations\/([^/]+)\/accept$/);
  if (method === 'POST' && invitationAccept) {
    const invitationId = decodeURIComponent(invitationAccept[1]);
    const index = state.invitations.findIndex((item) => item.id === invitationId);
    if (index < 0) throw new DemoHttpError('Invitation introuvable', 404);
    const invitation = state.invitations[index];
    state.invitations.splice(index, 1);
    const company = {
      id: invitation.companyId || nextId(state, 'co'),
      name: invitation.companyName,
      siret: invitation.siret || '',
      tva: '',
      address: invitation.address || '',
      phone: '',
      email: '',
      website: '',
      description: invitation.message || '',
      role: invitation.role || 'member',
      createdAt: new Date().toISOString(),
      members: [
        {
          id: 'user-inviter',
          name: invitation.inviterName,
          email: 'contact@atelier-nord.example',
          role: 'owner',
        },
        {
          id: state.user.id,
          name: state.user.name,
          email: state.user.email,
          role: invitation.role || 'member',
        },
      ],
      orders: [],
    };
    state.companies.push(company);
    return { success: true, company: clone(company) };
  }

  const invitationDecline = path.match(/^\/companies\/invitations\/([^/]+)\/decline$/);
  if (method === 'POST' && invitationDecline) {
    const invitationId = decodeURIComponent(invitationDecline[1]);
    state.invitations = state.invitations.filter((item) => item.id !== invitationId);
    return { success: true };
  }

  if (method === 'GET' && path === '/companies') {
    return { companies: clone(state.companies) };
  }

  if (method === 'POST' && path === '/companies') {
    const company = {
      id: nextId(state, 'co'),
      name: body.name || 'Nouvelle entreprise',
      siret: body.siret || '',
      tva: body.tva || '',
      address: body.address || '',
      phone: body.phone || '',
      email: body.email || '',
      website: body.website || '',
      description: body.description || '',
      role: 'owner',
      createdAt: new Date().toISOString(),
      members: [
        {
          id: state.user.id,
          name: state.user.name,
          email: state.user.email,
          role: 'owner',
        },
      ],
      orders: [],
    };
    state.companies.push(company);
    return { company: clone(company) };
  }

  if (method === 'DELETE' && path === '/companies') {
    state.companies = state.companies.filter((company) => company.id !== body.id);
    return { success: true };
  }

  const memberRole = path.match(/^\/companies\/([^/]+)\/members\/([^/]+)\/role$/);
  if (method === 'PUT' && memberRole) {
    const company = findCompany(state, decodeURIComponent(memberRole[1]));
    const member = (company.members || []).find((item) => item.id === decodeURIComponent(memberRole[2]));
    if (!member) throw new DemoHttpError('Membre introuvable', 404);
    if (member.role === 'owner') {
      throw new DemoHttpError('Impossible de modifier le propriétaire', 400);
    }
    member.role = body.role || member.role;
    return { member: clone(member) };
  }

  const memberDelete = path.match(/^\/companies\/([^/]+)\/members\/([^/]+)$/);
  if (method === 'DELETE' && memberDelete) {
    const company = findCompany(state, decodeURIComponent(memberDelete[1]));
    const memberId = decodeURIComponent(memberDelete[2]);
    const member = (company.members || []).find((item) => item.id === memberId);
    if (member?.role === 'owner') {
      throw new DemoHttpError('Impossible de supprimer le propriétaire', 400);
    }
    company.members = (company.members || []).filter((item) => item.id !== memberId);
    return { success: true };
  }

  const members = path.match(/^\/companies\/([^/]+)\/members$/);
  if (method === 'GET' && members) {
    const company = findCompany(state, decodeURIComponent(members[1]));
    return { members: clone(company.members || []) };
  }

  const companyOrders = path.match(/^\/companies\/([^/]+)\/orders$/);
  if (method === 'GET' && companyOrders) {
    const company = findCompany(state, decodeURIComponent(companyOrders[1]));
    return { orders: clone(company.orders || []) };
  }

  const invite = path.match(/^\/companies\/([^/]+)\/invite$/);
  if (method === 'POST' && invite) {
    findCompany(state, decodeURIComponent(invite[1]));
    return {
      success: true,
      invitation: {
        email: body.email,
        role: body.role || 'member',
        message: body.message || '',
      },
      message: "Invitation simulée. Aucun e-mail n'a été envoyé.",
    };
  }

  const leave = path.match(/^\/companies\/([^/]+)\/leave$/);
  if (method === 'POST' && leave) {
    const companyId = decodeURIComponent(leave[1]);
    const company = findCompany(state, companyId);
    if (company.role === 'owner') {
      throw new DemoHttpError("Le propriétaire ne peut pas quitter l'entreprise", 400);
    }
    state.companies = state.companies.filter((item) => item.id !== companyId);
    return { success: true };
  }

  const companyItem = path.match(/^\/companies\/([^/]+)$/);
  if (companyItem) {
    const company = findCompany(state, decodeURIComponent(companyItem[1]));
    if (method === 'GET') {
      return { company: clone(company) };
    }
    if (method === 'PUT') {
      ['name', 'siret', 'address', 'phone', 'email', 'website', 'tva', 'description'].forEach((key) => {
        if (body[key] !== undefined) company[key] = body[key];
      });
      return { company: clone(company) };
    }
  }

  if (method === 'POST' && path === '/contact') {
    state.messages.push({
      id: nextId(state, 'msg'),
      name: body.name || '',
      email: body.email || '',
      subject: body.subject || '',
      message: body.message || '',
      createdAt: new Date().toISOString(),
    });
    return {
      success: true,
      message: 'Message enregistré sur cet appareil. Aucun envoi réseau.',
    };
  }

  if (method === 'GET' && path === '/dashboard/stats') {
    const revenue = state.orders.reduce((sum, order) => sum + (order.total || 0), 0);
    return {
      orders: state.orders.length,
      revenue,
      articles: PRODUCTS.length,
      customers: 1,
    };
  }

  if (
    method === 'POST' &&
    (path === '/stripe/create-cart-checkout' || path === '/stripe/create-checkout')
  ) {
    return placeOrder(state, null);
  }

  if (method === 'POST' && path === '/stripe/create-company-checkout') {
    return placeOrder(state, body.companyId);
  }

  if (method === 'POST' && path === '/stripe/create-portal') {
    return {
      simulated: true,
      message: 'Portail de facturation indisponible en démo.',
    };
  }

  if (method === 'POST' && path === '/stripe/verify-session') {
    return { simulated: true, paid: true, status: 'complete' };
  }

  throw new DemoHttpError(`Route démo inconnue : ${method} ${path}`, 404);
}
