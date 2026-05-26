<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const navOpen = ref(false)
const lang = ref('fr')

const calendlyUrl = 'https://calendly.com/alyosperformance'
const calendlyEmbedUrl = `${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=f5f0e8`
const formspreeEndpoint = ''

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
})

const submitState = ref('idle')

const canSubmit = computed(() => {
  return (
    submitState.value !== 'sending' &&
    form.value.name.trim().length > 1 &&
    form.value.email.trim().length > 3 &&
    form.value.message.trim().length > 5
  )
})

async function submitContact() {
  if (!canSubmit.value) return

  submitState.value = 'sending'
  const payload = {
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    message: form.value.message,
    source: 'website',
  }

  try {
    if (formspreeEndpoint) {
      const res = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Form submission failed')
    } else {
      const subject = encodeURIComponent('Demande de rendez-vous / contact')
      const body = encodeURIComponent(
        `Nom: ${payload.name}\nEmail: ${payload.email}\nTéléphone: ${payload.phone}\n\nMessage:\n${payload.message}`,
      )
      window.location.href = `mailto:contact@exemple.com?subject=${subject}&body=${body}`
    }

    submitState.value = 'success'
    form.value = { name: '', email: '', phone: '', message: '' }
  } catch {
    submitState.value = 'error'
  }
}

const photos = [
  'photos/1b0b728a-ed2a-479e-833c-3faea2a65246.jpeg',
  'photos/6af518ab-0b44-40f6-b53a-2ed2fad52c92.jpeg',
  'photos/79651b91-5f66-41d9-a1e9-629de2e23d10.jpeg',
  'photos/7bebeb7f-f42b-45f2-8a0f-501a12827343.jpeg',
  'photos/7c87b008-bef0-4b1f-ad91-f5d5649445e6.jpeg',
  'photos/7d068cfe-c8ba-4ab0-b8ca-9f99d0f428d9.jpeg',
  'photos/b0eaef72-ed1f-4388-b44f-0f57b2e45d5b.jpeg',
  'photos/c7aac452-4ade-4f40-ba3a-b6ea80fa8aa9.jpeg',
  'photos/ee87fa54-0ca3-4eb0-8aaa-d5fab4f6ff24.jpeg',
  'photos/f2310427-a312-49ea-9523-d56625c5d7b9.jpeg',
]

const logoSrc = photos[photos.length - 1]
const galleryPhotos = photos.slice(0, -1)

const translations = {
  fr: {
    nav: {
      concept: 'Concept',
      services: 'Services',
      studio: 'Studio',
      contact: 'Contact',
      book: 'Réserver',
      menu: 'Menu',
    },
    hero: {
      eyebrow: 'Massage • Récupération • Performance',
      title: 'Bouge mieux.',
      subtitle: 'Récupère plus profondément.',
      text: 'Une expérience premium dédiée à la récupération, à la mobilité et au bien-être du corps. Des séances ciblées, simples à réserver, pensées pour accompagner ton rythme et tes objectifs.',
      primary: 'Prendre rendez-vous',
      secondary: 'Découvrir',
      stats: [
        ['01', 'Récupération', 'Sport, détente, mobilité'],
        ['02', 'Performance', 'Prévention, préparation, retour à l’effort'],
        ['03', 'Réservation', 'Calendly, contact rapide, suivi clair'],
      ],
    },
    concept: {
      eyebrow: 'Concept',
      title: 'Un espace dédié au corps en mouvement.',
      text: 'Chaque séance est construite pour répondre à un besoin concret : relâcher une zone tendue, améliorer la récupération, ou simplement te remettre bien dans ton corps.',
      missionLabel: 'Mission',
      mission: 'Améliorer ton confort au quotidien et t’aider à bouger sans gêne.',
      goalsLabel: 'Objectifs',
      goals: 'Prévenir les douleurs, optimiser la mobilité et soutenir la performance.',
    },
    services: {
      eyebrow: 'Services',
      title: 'S’entraîner. Récupérer. Repartir.',
      text: 'Des formats simples, avec une intention précise pour chaque séance.',
      items: [
        ['01', 'Massage Sportif', 'Récupération musculaire, tensions, préparation / retour d’effort.', 'Disponible'],
        ['02', 'Cupping Therapy', 'Ventouses pour relâcher les adhérences et améliorer la souplesse.', 'Sur demande'],
        ['03', 'Préparation Physique', 'Programme sur mesure selon tes objectifs et ton niveau.', 'Bientôt'],
        ['04', 'Ostéo Massage', 'Travail ciblé pour la mobilité et les zones sensibles.', 'Disponible'],
      ],
    },
    gallery: {
      eyebrow: 'Studio',
      title: 'Ambiance & séances',
      text: 'Photos utilisées : dossier Francis',
    },
    contact: {
      eyebrow: 'Réservation',
      title: 'Réserve ta séance.',
      text: 'Dis-moi ce dont tu as besoin (zone, douleur, objectif). Je te propose un créneau et un format adapté.',
      calendar: 'Calendrier',
      calendarText: 'Choisis un créneau directement dans le calendrier.',
      openCalendar: 'Ouvrir en plein écran',
      formTitle: 'Formulaire de contact',
      formText: 'Tu peux envoyer un message, même si tu ne trouves pas de créneau parfait.',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone (optionnel)',
      message: 'Message',
      namePlaceholder: 'Votre nom',
      emailPlaceholder: 'vous@email.com',
      phonePlaceholder: '+32 ...',
      messagePlaceholder: 'Expliquez votre besoin (douleurs, zone, objectif, disponibilité…)',
      sending: 'Envoi…',
      send: 'Envoyer',
      success: 'Message envoyé.',
      error: 'Impossible d’envoyer le message. Réessaie ou contacte directement par email.',
      address: 'Adresse',
      addressValue: 'Ixelles, Bruxelles',
      networks: 'Réseaux',
      networksValue: 'Instagram / LinkedIn / Facebook',
      backTop: 'Retour en haut',
    },
    footer: {
      rights: 'Tous droits réservés.',
      legal: 'Mentions légales',
    },
  },
  en: {
    nav: {
      concept: 'Concept',
      services: 'Services',
      studio: 'Studio',
      contact: 'Contact',
      book: 'Book',
      menu: 'Menu',
    },
    hero: {
      eyebrow: 'Massage • Recovery • Performance',
      title: 'Move better.',
      subtitle: 'Recover deeper.',
      text: 'A premium experience dedicated to recovery, mobility, and body wellbeing. Targeted sessions, easy booking, and a clear approach designed around your rhythm and goals.',
      primary: 'Book a session',
      secondary: 'Discover',
      stats: [
        ['01', 'Recovery', 'Sport, relaxation, mobility'],
        ['02', 'Performance', 'Prevention, preparation, return to effort'],
        ['03', 'Booking', 'Calendly, quick contact, clear follow-up'],
      ],
    },
    concept: {
      eyebrow: 'Concept',
      title: 'A space dedicated to the body in motion.',
      text: 'Each session is built around a clear need: releasing tension, improving recovery, or simply helping you feel better in your body.',
      missionLabel: 'Mission',
      mission: 'Improve your daily comfort and help you move without discomfort.',
      goalsLabel: 'Goals',
      goals: 'Prevent pain, optimize mobility, and support performance.',
    },
    services: {
      eyebrow: 'Services',
      title: 'Train. Recover. Reset.',
      text: 'Simple formats with a precise intention for every session.',
      items: [
        ['01', 'Sports Massage', 'Muscle recovery, tension release, preparation / post-effort support.', 'Available'],
        ['02', 'Cupping Therapy', 'Cupping to release adhesions and improve flexibility.', 'On request'],
        ['03', 'Physical Preparation', 'A custom program based on your goals and level.', 'Coming soon'],
        ['04', 'Osteo Massage', 'Targeted work for mobility and sensitive areas.', 'Available'],
      ],
    },
    gallery: {
      eyebrow: 'Studio',
      title: 'Atmosphere & sessions',
      text: 'Photos used: Francis folder',
    },
    contact: {
      eyebrow: 'Booking',
      title: 'Book your session.',
      text: 'Tell me what you need: area, pain, objective. I will suggest a time slot and a suitable format.',
      calendar: 'Calendar',
      calendarText: 'Choose a slot directly in the calendar.',
      openCalendar: 'Open full screen',
      formTitle: 'Contact form',
      formText: 'You can send a message even if you do not find the perfect time slot.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone (optional)',
      message: 'Message',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'you@email.com',
      phonePlaceholder: '+32 ...',
      messagePlaceholder: 'Explain your need: pain, area, goal, availability…',
      sending: 'Sending…',
      send: 'Send',
      success: 'Message sent.',
      error: 'Unable to send the message. Try again or contact directly by email.',
      address: 'Address',
      addressValue: 'Ixelles, Brussels',
      networks: 'Socials',
      networksValue: 'Instagram / LinkedIn / Facebook',
      backTop: 'Back to top',
    },
    footer: {
      rights: 'All rights reserved.',
      legal: 'Legal notice',
    },
  },
}

const t = computed(() => translations[lang.value])

let ctx

onMounted(async () => {
  await nextTick()

  ctx = gsap.context(() => {
    gsap.from('[data-hero]', {
      opacity: 0,
      y: 16,
      duration: 0.9,
      ease: 'power2.out',
      stagger: 0.08,
    })

    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
        },
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div class="relative min-h-screen bg-[#050505] text-[#f5f0e8]">
    <div class="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(245,240,232,0.08),transparent_30%),linear-gradient(180deg,#050505_0%,#101010_46%,#050505_100%)]" />

    <header class="fixed inset-x-0 top-0 z-50 border-b border-[#f5f0e8]/10 bg-[#050505]">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <a href="#top" class="flex items-center gap-3 font-semibold tracking-tight">
          <img
            :src="logoSrc"
            alt="Logo"
            class="h-10 w-10 rounded-full border border-[#f5f0e8]/20 object-contain"
            loading="eager"
            decoding="async"
          />
        </a>

        <nav class="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.22em] text-[#f5f0e8]/70 md:flex">
          <a class="hover:text-[#f5f0e8]" href="#apropos">{{ t.nav.concept }}</a>
          <a class="hover:text-[#f5f0e8]" href="#prestations">{{ t.nav.services }}</a>
          <a class="hover:text-[#f5f0e8]" href="#galerie">{{ t.nav.studio }}</a>
          <a class="hover:text-[#f5f0e8]" href="#contact">{{ t.nav.contact }}</a>
          <button
            class="rounded-full border border-[#f5f0e8]/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f0e8] hover:bg-[#111]"
            type="button"
            @click="lang = lang === 'fr' ? 'en' : 'fr'"
          >
            {{ lang === 'fr' ? 'EN' : 'FR' }}
          </button>
          <a
            class="rounded-full bg-[#f5f0e8] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black hover:bg-white"
            href="#contact"
          >
            {{ t.nav.book }}
          </a>
        </nav>

        <button
          class="rounded-full border border-[#f5f0e8]/15 bg-black px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f5f0e8] md:hidden"
          type="button"
          @click="navOpen = !navOpen"
        >
          {{ t.nav.menu }}
        </button>
      </div>

      <div v-if="navOpen" class="border-t border-[#f5f0e8]/10 bg-[#050505] md:hidden">
        <div class="mx-auto grid max-w-7xl gap-2 px-5 py-5 text-sm text-[#f5f0e8]/80">
          <a class="py-2 hover:text-[#f5f0e8]" href="#apropos" @click="navOpen = false">{{ t.nav.concept }}</a>
          <a class="py-2 hover:text-[#f5f0e8]" href="#prestations" @click="navOpen = false">{{ t.nav.services }}</a>
          <a class="py-2 hover:text-[#f5f0e8]" href="#galerie" @click="navOpen = false">{{ t.nav.studio }}</a>
          <a class="py-2 hover:text-[#f5f0e8]" href="#contact" @click="navOpen = false">{{ t.nav.contact }}</a>
          <button
            class="w-fit rounded-full border border-[#f5f0e8]/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f0e8]"
            type="button"
            @click="lang = lang === 'fr' ? 'en' : 'fr'"
          >
            {{ lang === 'fr' ? 'EN' : 'FR' }}
          </button>
          <a
            class="mt-2 inline-flex w-fit rounded-full bg-[#f5f0e8] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black"
            href="#contact"
            @click="navOpen = false"
          >
            {{ t.nav.book }}
          </a>
        </div>
      </div>
    </header>

    <main id="top" class="relative z-10 pt-20">
      <section class="relative">
        <div class="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-16 md:py-28">
          <div class="max-w-5xl">
            <p data-hero class="text-xs font-semibold uppercase tracking-[0.32em] text-[#f5f0e8]/60">{{ t.hero.eyebrow }}</p>
            <h1
              data-hero
              class="mt-6 max-w-5xl text-5xl font-semibold uppercase leading-[0.92] tracking-[-0.06em] md:text-8xl lg:text-9xl"
            >
              {{ t.hero.title }}
              <span class="block text-[#f5f0e8]/55">{{ t.hero.subtitle }}</span>
            </h1>
            <p data-hero class="mt-8 max-w-2xl text-lg leading-relaxed text-[#f5f0e8]/70">
              {{ t.hero.text }}
            </p>
            <div data-hero class="mt-10 flex flex-wrap items-center gap-3">
              <a
                class="rounded-full bg-[#f5f0e8] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-black hover:bg-white"
                href="#contact"
              >
                {{ t.hero.primary }}
              </a>
              <a
                class="rounded-full border border-[#f5f0e8]/20 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f0e8] hover:bg-[#111]"
                href="#prestations"
              >
                {{ t.hero.secondary }}
              </a>
            </div>

            <div data-hero class="mt-14 grid gap-3 text-sm text-[#f5f0e8]/70 sm:grid-cols-3">
              <div
                v-for="item in t.hero.stats"
                :key="item[0]"
                class="border-y border-[#f5f0e8]/10 py-5"
              >
                <p class="text-xs uppercase tracking-[0.22em] text-[#f5f0e8]/45">{{ item[0] }}</p>
                <p class="mt-3 font-medium text-[#f5f0e8]">{{ item[1] }}</p>
                <p class="mt-1">{{ item[2] }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="apropos" class="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div data-reveal class="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#f5f0e8]/55">{{ t.concept.eyebrow }}</p>
            <h2 class="mt-5 max-w-3xl text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">
              {{ t.concept.title }}
            </h2>
            <p class="mt-7 max-w-xl leading-relaxed text-[#f5f0e8]/70">
              {{ t.concept.text }}
            </p>
          </div>
          <div class="grid gap-4">
            <div class="border border-[#f5f0e8]/10 bg-[#0b0b0b] p-6">
              <p class="text-xs uppercase tracking-[0.24em] text-[#f5f0e8]/45">{{ t.concept.missionLabel }}</p>
              <p class="mt-4 text-lg font-medium text-[#f5f0e8]">{{ t.concept.mission }}</p>
            </div>
            <div class="border border-[#f5f0e8]/10 bg-[#0b0b0b] p-6">
              <p class="text-xs uppercase tracking-[0.24em] text-[#f5f0e8]/45">{{ t.concept.goalsLabel }}</p>
              <p class="mt-4 text-lg font-medium text-[#f5f0e8]">{{ t.concept.goals }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="prestations" class="border-y border-[#f5f0e8]/10 bg-[#f5f0e8] text-black">
        <div class="mx-auto max-w-7xl px-5 py-20 md:py-28">
          <div data-reveal class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">{{ t.services.eyebrow }}</p>
            <h2 class="mt-5 text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">{{ t.services.title }}</h2>
            <p class="mt-7 leading-relaxed text-black/65">
              {{ t.services.text }}
            </p>
          </div>

          <div class="mt-12 grid border-t border-black/15 md:grid-cols-2">
            <article
              v-for="(item, index) in t.services.items"
              :key="item[0]"
              data-reveal
              class="border-b border-black/15 py-8"
              :class="index % 2 === 0 ? 'md:border-r md:pr-8' : 'md:pl-8'"
            >
              <p class="text-xs uppercase tracking-[0.24em] text-black/45">{{ item[0] }}</p>
              <h3 class="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em]">{{ item[1] }}</h3>
              <p class="mt-3 text-black/65">{{ item[2] }}</p>
              <p class="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/55">{{ item[3] }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="galerie" class="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div data-reveal class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#f5f0e8]/55">{{ t.gallery.eyebrow }}</p>
            <h2 class="mt-5 text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">{{ t.gallery.title }}</h2>
          </div>
          <p class="text-sm text-[#f5f0e8]/60">{{ t.gallery.text }}</p>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="src in galleryPhotos"
            :key="src"
            data-reveal
            class="group relative overflow-hidden border border-[#f5f0e8]/10 bg-[#0b0b0b]"
          >
            <img
              class="h-72 w-full object-cover object-[50%_20%] grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
              :src="src"
              alt=""
            />
          </div>
        </div>
      </section>

      <section id="contact" class="border-t border-[#f5f0e8]/10 bg-[#050505]">
        <div class="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
          <div data-reveal>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#f5f0e8]/55">{{ t.contact.eyebrow }}</p>
            <h2 class="mt-5 text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">{{ t.contact.title }}</h2>
            <p class="mt-7 max-w-xl leading-relaxed text-[#f5f0e8]/70">
              {{ t.contact.text }}
            </p>
            <div class="mt-10 border border-[#f5f0e8]/10 bg-black p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#f5f0e8]/60">{{ t.contact.calendar }}</p>
              <p class="mt-2 text-sm text-[#f5f0e8]/70">{{ t.contact.calendarText }}</p>
              <div class="mt-4 overflow-hidden border border-[#f5f0e8]/10 bg-black">
                <iframe
                  class="block h-[720px] w-full"
                  :src="calendlyEmbedUrl"
                  :title="t.contact.calendar"
                  frameborder="0"
                />
              </div>
              <div class="mt-4 flex flex-wrap gap-3">
                <a
                  class="rounded-full border border-[#f5f0e8]/20 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f0e8] hover:bg-[#111]"
                  :href="calendlyUrl"
                  target="_blank"
                  rel="noreferrer"
                >
                  {{ t.contact.openCalendar }}
                </a>
              </div>
            </div>
          </div>

          <div data-reveal class="border border-[#f5f0e8]/10 bg-black p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#f5f0e8]/60">{{ t.contact.formTitle }}</p>
            <p class="mt-3 text-sm text-[#f5f0e8]/70">
              {{ t.contact.formText }}
            </p>

            <form class="mt-5 grid gap-4" @submit.prevent="submitContact">
              <div class="grid gap-2">
                <label class="text-sm font-medium text-[#f5f0e8]/80" for="name">{{ t.contact.name }}</label>
                <input
                  id="name"
                  v-model="form.name"
                  class="h-12 border border-[#f5f0e8]/10 bg-[#0b0b0b] px-4 text-sm text-[#f5f0e8] outline-none ring-[#f5f0e8]/30 placeholder:text-[#f5f0e8]/35 focus:ring-2"
                  type="text"
                  autocomplete="name"
                  :placeholder="t.contact.namePlaceholder"
                  required
                />
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="grid gap-2">
                  <label class="text-sm font-medium text-[#f5f0e8]/80" for="email">{{ t.contact.email }}</label>
                  <input
                    id="email"
                    v-model="form.email"
                    class="h-12 border border-[#f5f0e8]/10 bg-[#0b0b0b] px-4 text-sm text-[#f5f0e8] outline-none ring-[#f5f0e8]/30 placeholder:text-[#f5f0e8]/35 focus:ring-2"
                    type="email"
                    autocomplete="email"
                    :placeholder="t.contact.emailPlaceholder"
                    required
                  />
                </div>
                <div class="grid gap-2">
                  <label class="text-sm font-medium text-[#f5f0e8]/80" for="phone">{{ t.contact.phone }}</label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    class="h-12 border border-[#f5f0e8]/10 bg-[#0b0b0b] px-4 text-sm text-[#f5f0e8] outline-none ring-[#f5f0e8]/30 placeholder:text-[#f5f0e8]/35 focus:ring-2"
                    type="tel"
                    autocomplete="tel"
                    :placeholder="t.contact.phonePlaceholder"
                  />
                </div>
              </div>

              <div class="grid gap-2">
                <label class="text-sm font-medium text-[#f5f0e8]/80" for="message">{{ t.contact.message }}</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  class="min-h-[120px] resize-y border border-[#f5f0e8]/10 bg-[#0b0b0b] px-4 py-3 text-sm text-[#f5f0e8] outline-none ring-[#f5f0e8]/30 placeholder:text-[#f5f0e8]/35 focus:ring-2"
                  :placeholder="t.contact.messagePlaceholder"
                  required
                />
              </div>

              <button
                class="inline-flex h-12 items-center justify-center rounded-full bg-[#f5f0e8] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                :disabled="!canSubmit"
              >
                <span v-if="submitState === 'sending'">{{ t.contact.sending }}</span>
                <span v-else>{{ t.contact.send }}</span>
              </button>

              <p v-if="submitState === 'success'" class="text-sm text-[#f5f0e8]/70">{{ t.contact.success }}</p>
              <p v-else-if="submitState === 'error'" class="text-sm text-[#f5f0e8]/70">
                {{ t.contact.error }}
              </p>
            </form>

            <div class="mt-8 grid gap-4 text-sm text-[#f5f0e8]/80">
              <div>
                <p class="font-medium text-[#f5f0e8]">{{ t.contact.address }}</p>
                <p class="mt-1 text-[#f5f0e8]/70">{{ t.contact.addressValue }}</p>
              </div>
              <div>
                <p class="font-medium text-[#f5f0e8]">Email</p>
                <p class="mt-1 text-[#f5f0e8]/70">contact@exemple.com</p>
              </div>
              <div>
                <p class="font-medium text-[#f5f0e8]">{{ t.contact.networks }}</p>
                <p class="mt-1 text-[#f5f0e8]/70">{{ t.contact.networksValue }}</p>
              </div>
              <div class="pt-2">
                <a
                  class="inline-flex rounded-full border border-[#f5f0e8]/20 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f0e8] hover:bg-[#111]"
                  href="#top"
                >
                  {{ t.contact.backTop }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer class="border-t border-[#f5f0e8]/10">
          <div class="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-[#f5f0e8]/55 md:flex-row md:items-center md:justify-between">
            <p>© {{ new Date().getFullYear() }} Francis Massage. {{ t.footer.rights }}</p>
            <p>{{ t.footer.legal }}</p>
          </div>
        </footer>
      </section>
    </main>
  </div>
</template>

