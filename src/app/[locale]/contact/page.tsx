import React from 'react';

export default function ContactPage() {
  return (
    <>
      <link
  rel="preload"
  as="image"
  href="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
/>
<section
  id="relume"
  className="grid h-auto w-full grid-cols-[1fr_max-content_1fr] items-center justify-between border-b border-border-primary bg-background-primary px-[5%] md:min-h-18"
>
  <button className="flex size-12 flex-col justify-center lg:hidden">
    <span className="my-[3px] h-0.5 w-6 bg-black lg:hidden"></span
    ><span className="my-[3px] h-0.5 w-6 bg-black lg:hidden"></span
    ><span className="my-[3px] h-0.5 w-6 bg-black lg:hidden"></span>
  </button>
  <div
   
   
   
   
    className="absolute left-0 top-0 z-50 flex h-dvh w-[90%] flex-col border-r border-border-primary bg-white px-[5%] pb-4 md:w-[80%] lg:visible lg:static lg:-ml-4 lg:flex lg:h-auto lg:w-auto lg:flex-row lg:border-none lg:px-0 lg:pb-0 lg:[--opacity-closed:100%] lg:[--x-closed:0%]"
  ></div>
  <div
    className="fixed inset-0 z-40 bg-black lg:hidden hidden"
    style={{ "opacity": 0 } as React.CSSProperties}
  ></div>
  <a href="#" className="flex min-h-16 flex-shrink-0 items-center"
    ><img
      src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
      alt="Logo image"
  /></a>
  <div className="flex min-h-16 items-center justify-end gap-x-4">
    <div>
      <button
        className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary bg-background-alternative text-text-alternative px-4 py-1 md:px-6 md:py-2"
        title="Access"
      >
        Access
      </button>
    </div>
  </div>
</section>

<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div className="container max-w-lg text-center">
    <p className="mb-3 font-semibold md:mb-4">Tagline</p>
    <h1
     
      className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl"
    >
      Short heading here
    </h1>
    <p className="md:text-md">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      varius enim in eros elementum tristique.
    </p>
    <div
     
     
      className="mt-6 flex items-center justify-center gap-x-4 md:mt-8"
    >
      <button
        className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary bg-background-alternative text-text-alternative px-6 py-3"
        title="Button"
       
      >
        Button</button
      ><button
        className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3"
        title="Button"
       
      >
        Button
      </button>
    </div>
  </div>
</section>

<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div className="container">
    <div
     
      className="rb-12 mb-12 max-w-lg md:mb-18 lg:mb-20"
    >
      <p className="mb-3 font-semibold md:mb-4">Tagline</p>
      <h2
       
        className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl"
      >
        Contact us
      </h2>
      <p className="md:text-md">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </div>
    <div
      className="grid grid-cols-1 items-start justify-start gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4"
    >
      <div>
        <div className="rb-5 mb-5 md:mb-6">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-12"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z"
            ></path>
          </svg>
        </div>
        <h3
          className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl"
        >
          Email
        </h3>
        <p className="mb-5 md:mb-6">
          For bookings and inquiries, contact our premium team directly.
        </p>
        <a className="underline" href="#">hello@relume.io</a>
      </div>
      <div>
        <div className="rb-5 mb-5 md:mb-6">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-12"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h3v3.767L13.277 18H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14h-7.277L9 18.233V16H4V4h16v12z"
            ></path>
            <path d="M7 7h10v2H7zm0 4h7v2H7z"></path>
          </svg>
        </div>
        <h3
          className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl"
        >
          WhatsApp
        </h3>
        <p className="mb-5 md:mb-6">
          Message us instantly for real-time availability and instant
          confirmations.
        </p>
        <a className="underline" href="#">Start conversation</a>
      </div>
      <div>
        <div className="rb-5 mb-5 md:mb-6">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-12"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.707 12.293a.999.999 0 0 0-1.414 0l-1.594 1.594c-.739-.22-2.118-.72-2.992-1.594s-1.374-2.253-1.594-2.992l1.594-1.594a.999.999 0 0 0 0-1.414l-4-4a.999.999 0 0 0-1.414 0L3.581 5.005c-.38.38-.594.902-.586 1.435.023 1.424.4 6.37 4.298 10.268s8.844 4.274 10.269 4.298h.028c.528 0 1.027-.208 1.405-.586l2.712-2.712a.999.999 0 0 0 0-1.414l-4-4.001zm-.127 6.712c-1.248-.021-5.518-.356-8.873-3.712-3.366-3.366-3.692-7.651-3.712-8.874L7 4.414 9.586 7 8.293 8.293a1 1 0 0 0-.272.912c.024.115.611 2.842 2.271 4.502s4.387 2.247 4.502 2.271a.991.991 0 0 0 .912-.271L17 14.414 19.586 17l-2.006 2.005z"
            ></path>
          </svg>
        </div>
        <h3
          className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl"
        >
          Phone
        </h3>
        <p className="mb-5 md:mb-6">
          Speak with our concierge team for personalized recommendations and
          bookings.
        </p>
        <a className="underline" href="#">+34 971 190 588</a>
      </div>
      <div>
        <div className="rb-5 mb-5 md:mb-6">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-12"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z"
            ></path>
            <path
              d="M11.42 21.814a.998.998 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819zM12 4c3.309 0 6 2.691 6 6.005.021 4.438-4.388 8.423-6 9.73-1.611-1.308-6.021-5.294-6-9.735 0-3.309 2.691-6 6-6z"
            ></path>
          </svg>
        </div>
        <h3
          className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl"
        >
          Office
        </h3>
        <p className="mb-5 md:mb-6">
          Visit our Ibiza headquarters to discuss bespoke experiences in person.
        </p>
        <a className="underline" href="#"
          >Paseo Marítimo, Ibiza Town, 07800 Spain</a
        >
      </div>
    </div>
  </div>
</section>

<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div
    className="container grid grid-cols-1 items-start gap-y-12 md:grid-flow-row md:grid-cols-2 md:gap-x-12 lg:grid-flow-col lg:gap-x-20 lg:gap-y-16"
  >
    <div>
      <div className="mb-6 md:mb-8">
        <p className="mb-3 font-semibold md:mb-4">Tagline</p>
        <h2
         
          className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl"
        >
          Contact us
        </h2>
        <p className="md:text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 py-2">
        <div className="flex items-center gap-4">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6 flex-none"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z"
            ></path>
          </svg>
          <p>hello@relume.io</p>
        </div>
        <div className="flex items-center gap-4">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6 flex-none"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.707 12.293a.999.999 0 0 0-1.414 0l-1.594 1.594c-.739-.22-2.118-.72-2.992-1.594s-1.374-2.253-1.594-2.992l1.594-1.594a.999.999 0 0 0 0-1.414l-4-4a.999.999 0 0 0-1.414 0L3.581 5.005c-.38.38-.594.902-.586 1.435.023 1.424.4 6.37 4.298 10.268s8.844 4.274 10.269 4.298h.028c.528 0 1.027-.208 1.405-.586l2.712-2.712a.999.999 0 0 0 0-1.414l-4-4.001zm-.127 6.712c-1.248-.021-5.518-.356-8.873-3.712-3.366-3.366-3.692-7.651-3.712-8.874L7 4.414 9.586 7 8.293 8.293a1 1 0 0 0-.272.912c.024.115.611 2.842 2.271 4.502s4.387 2.247 4.502 2.271a.991.991 0 0 0 .912-.271L17 14.414 19.586 17l-2.006 2.005z"
            ></path>
          </svg>
          <p>+1 (555) 000-0000</p>
        </div>
        <div className="flex items-center gap-4">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6 flex-none"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z"
            ></path>
            <path
              d="M11.42 21.814a.998.998 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819zM12 4c3.309 0 6 2.691 6 6.005.021 4.438-4.388 8.423-6 9.73-1.611-1.308-6.021-5.294-6-9.735 0-3.309 2.691-6 6-6z"
            ></path>
          </svg>
          <p>123 Sample St, Sydney NSW 2000 AU</p>
        </div>
      </div>
    </div>
    <form
     
      className="grid max-w-lg grid-cols-1 grid-rows-[auto_auto] gap-6"
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="grid w-full items-center">
          <label
            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
            htmlFor="firstName"
            >First name</label
          >
          <div className="relative flex w-full items-center">
            <input
              type="text"
              className="flex size-full min-h-11 border border-border-primary bg-background-primary py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-3"
              id="firstName"
            />
          </div>
        </div>
        <div className="grid w-full items-center">
          <label
            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
            htmlFor="lastName"
            >Last name</label
          >
          <div className="relative flex w-full items-center">
            <input
              type="text"
              className="flex size-full min-h-11 border border-border-primary bg-background-primary py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-3"
              id="lastName"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid w-full items-center">
          <label
            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
            htmlFor="email"
            >Email</label
          >
          <div className="relative flex w-full items-center">
            <input
              type="email"
              className="flex size-full min-h-11 border border-border-primary bg-background-primary py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-3"
              id="email"
            />
          </div>
        </div>
        <div className="grid w-full items-center">
          <label
            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
            htmlFor="phone"
            >Phone number</label
          >
          <div className="relative flex w-full items-center">
            <input
              type="text"
              className="flex size-full min-h-11 border border-border-primary bg-background-primary py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-3"
              id="phone"
            />
          </div>
        </div>
      </div>
      <div className="grid w-full items-center">
        <label
          className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
          >Choose a topic</label
        ><button
          type="button"
          role="combobox"
          aria-controls="radix-«R2e»"
          aria-expanded="false"
          aria-autocomplete="none"
          dir="ltr"
          data-state="closed"
          data-placeholder=""
          className="flex min-h-11 w-full items-center justify-between gap-1 whitespace-nowrap border border-border-primary bg-transparent px-3 py-2 text-text-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&amp;&gt;span]:line-clamp-1 [&amp;[data-state=open]&gt;svg]:rotate-180"
        >
          <span style={{ "pointerEvents": "none" } as React.CSSProperties}>Select one...</span
          ><svg
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 15 15"
            className="size-5 transition-transform duration-300"
            aria-hidden="true"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
              fill="currentColor"
            ></path>
          </svg></button
        ><select
          aria-hidden="true"
          tabIndex={-1}
          style={{ "position": "absolute", "border": 0, "width": "1px", "height": "1px", "padding": 0, "margin": "-1px", "overflow": "hidden", "clip": "rect(0, 0, 0, 0)", "whiteSpace": "nowrap", "wordWrap": "normal" } as React.CSSProperties}
        >
          <option value=""></option>
        </select>
      </div>
      <div className="grid w-full items-center py-3 md:py-4">
        <label
          className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3 md:mb-4"
          >Which best describes you?</label
        >
        <div
          role="radiogroup"
          aria-required="false"
          dir="ltr"
          className="gap-2 grid grid-cols-2 gap-x-6 gap-y-3.5"
          tabIndex={-1}
          style={{ "outline": "none" } as React.CSSProperties}
        >
          <div className="flex items-center space-x-2">
            <button
              type="button"
              role="radio"
              aria-checked="false"
              data-state="unchecked"
              value="First choice"
              id="#first_choice"
              className="aspect-square size-[1.125rem] rounded-full border border-border-primary text-text-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background-alternative"
              tabIndex={-1}
              data-radix-collection-item=""
            ></button
            ><input
              type="radio"
              aria-hidden="true"
              style={{ "transform": "translateX(-100%)", "position": "absolute", "pointerEvents": "none", "opacity": 0, "margin": 0 } as React.CSSProperties}
              tabIndex={-1}
              value="First choice"
            /><label
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="#first_choice"
              >First choice</label
            >
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              role="radio"
              aria-checked="false"
              data-state="unchecked"
              value="First choice"
              id="#second_choice"
              className="aspect-square size-[1.125rem] rounded-full border border-border-primary text-text-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background-alternative"
              tabIndex={-1}
              data-radix-collection-item=""
            ></button
            ><input
              type="radio"
              aria-hidden="true"
              style={{ "transform": "translateX(-100%)", "position": "absolute", "pointerEvents": "none", "opacity": 0, "margin": 0 } as React.CSSProperties}
              tabIndex={-1}
              value="First choice"
            /><label
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="#second_choice"
              >Second choice</label
            >
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              role="radio"
              aria-checked="false"
              data-state="unchecked"
              value="First choice"
              id="#third_choice"
              className="aspect-square size-[1.125rem] rounded-full border border-border-primary text-text-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background-alternative"
              tabIndex={-1}
              data-radix-collection-item=""
            ></button
            ><input
              type="radio"
              aria-hidden="true"
              style={{ "transform": "translateX(-100%)", "position": "absolute", "pointerEvents": "none", "opacity": 0, "margin": 0 } as React.CSSProperties}
              tabIndex={-1}
              value="First choice"
            /><label
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="#third_choice"
              >Third choice</label
            >
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              role="radio"
              aria-checked="false"
              data-state="unchecked"
              value="First choice"
              id="#fourth_choice"
              className="aspect-square size-[1.125rem] rounded-full border border-border-primary text-text-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background-alternative"
              tabIndex={-1}
              data-radix-collection-item=""
            ></button
            ><input
              type="radio"
              aria-hidden="true"
              style={{ "transform": "translateX(-100%)", "position": "absolute", "pointerEvents": "none", "opacity": 0, "margin": 0 } as React.CSSProperties}
              tabIndex={-1}
              value="First choice"
            /><label
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="#fourth_choice"
              >Fourth choice</label
            >
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              role="radio"
              aria-checked="false"
              data-state="unchecked"
              value="First choice"
              id="#fifth_choice"
              className="aspect-square size-[1.125rem] rounded-full border border-border-primary text-text-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background-alternative"
              tabIndex={-1}
              data-radix-collection-item=""
            ></button
            ><input
              type="radio"
              aria-hidden="true"
              style={{ "transform": "translateX(-100%)", "position": "absolute", "pointerEvents": "none", "opacity": 0, "margin": 0 } as React.CSSProperties}
              tabIndex={-1}
              value="First choice"
            /><label
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="#fifth_choice"
              >Fifth choice</label
            >
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              role="radio"
              aria-checked="false"
              data-state="unchecked"
              value="First choice"
              id="#other"
              className="aspect-square size-[1.125rem] rounded-full border border-border-primary text-text-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background-alternative"
              tabIndex={-1}
              data-radix-collection-item=""
            ></button
            ><input
              type="radio"
              aria-hidden="true"
              style={{ "transform": "translateX(-100%)", "position": "absolute", "pointerEvents": "none", "opacity": 0, "margin": 0 } as React.CSSProperties}
              tabIndex={-1}
              value="First choice"
            /><label
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="#other"
              >Other</label
            >
          </div>
        </div>
      </div>
      <div className="grid w-full items-center">
        <label
          className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
          htmlFor="message"
          >Message</label
        ><textarea
          className="flex w-full border border-border-primary bg-neutral-white p-3 placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[11.25rem] overflow-auto"
          id="message"
          placeholder="Type your message..."
        ></textarea>
      </div>
      <div className="mb-3 flex items-center space-x-2 text-sm md:mb-4">
        <button
          type="button"
          role="checkbox"
          aria-checked="false"
          data-state="unchecked"
          value="on"
          className="size-[1.125rem] border border-border-primary transition-all duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background-alternative data-[state=indeterminate]:bg-background-primary data-[state=checked]:text-text-alternative data-[state=indeterminate]:text-text-primary"
          id="terms"
        ></button
        ><input
          type="checkbox"
          aria-hidden="true"
          style={{ "transform": "translateX(-100%)", "position": "absolute", "pointerEvents": "none", "opacity": 0, "margin": 0 } as React.CSSProperties}
          tabIndex={-1}
          value="on"
        /><label
          className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          htmlFor="terms"
          >I accept the Terms</label
        >
      </div>
      <div>
        <button
          className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary bg-background-alternative text-text-alternative px-6 py-3"
          title="Submit"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</section>

<link
  rel="preload"
  as="image"
  href="https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg"
/><link
  rel="preload"
  as="image"
  href="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
/><link
  rel="preload"
  as="image"
  href="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
/>
<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div className="container">
    <div className="mb-12 md:mb-18 lg:mb-20">
      <div
       
        className="mx-auto w-full max-w-lg text-center"
      >
        <h1
         
          className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl"
        >
          Customer testimonials
        </h1>
        <p className="md:text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
    </div>
    <div
      className="gid-cols-1 grid gap-6 sm:grid-rows-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:grid-rows-2"
    >
      <div
        className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6"
      >
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg"
          alt="Relume logo 1"
          className="max-h-12"
        />
      </div>
      <div
        className="flex flex-col items-start justify-between border border-border-primary p-6 sm:col-span-2 md:p-8"
      >
        <div className="mb-5 flex md:mb-6">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"
            ></path></svg
          ><svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"
            ></path></svg
          ><svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"
            ></path></svg
          ><svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"
            ></path></svg
          ><svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"
            ></path>
          </svg>
        </div>
        <p className="md:text-md">
          &quot;They handled everything flawlessly. The yacht was perfect, the
          table was waiting, and nobody knew we were there. That&#x27;s what
          premium service means.&quot;
        </p>
        <div
          className="mt-5 flex w-full flex-col items-start md:mt-6 md:w-fit md:flex-row md:items-center"
        >
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              alt="Testimonial image 1"
              className="mb-4 size-12 min-h-12 min-w-12 rounded-full object-cover md:mb-0 md:mr-4"
            />
          </div>
          <div>
            <p className="font-semibold">M.K.</p>
            <p>Private equity, London</p>
          </div>
        </div>
      </div>
      <div
        className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6"
      >
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
          alt="Webflow logo 1"
          className="max-h-12"
        />
      </div>
      <div
        className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6"
      >
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
          alt="Webflow logo 2"
          className="max-h-12"
        />
      </div>
      <div
        className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6"
      >
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg"
          alt="Relume logo 2"
          className="max-h-12"
        />
      </div>
      <div
        className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6"
      >
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
          alt="Webflow logo 3"
          className="max-h-12"
        />
      </div>
      <div
        className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6"
      >
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg"
          alt="Relume logo 3"
          className="max-h-12"
        />
      </div>
    </div>
  </div>
</section>

<link
  rel="preload"
  as="image"
  href="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
/>
<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div className="container relative">
    <div
      className="relative z-10 flex flex-col items-center p-8 md:p-12 lg:p-16"
    ></div>
    <div className="absolute inset-0 z-0">
      <img
        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
        className="size-full object-cover"
        alt="Relume placeholder image"
      />
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
  </div>
</section>

<link
  rel="preload"
  as="image"
  href="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
/>
<footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20">
  <div className="container">
    <div
      className="grid grid-cols-1 items-start gap-x-[8vw] gap-y-12 pb-12 md:gap-y-16 md:pb-18 lg:grid-cols-[1fr_0.5fr] lg:gap-y-4 lg:pb-20"
    >
      <div
        className="grid grid-cols-1 items-start gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 md:gap-x-8 lg:grid-cols-4"
      >
        <a
          href="#"
          className="sm:col-start-1 sm:col-end-4 sm:row-start-1 sm:row-end-2 lg:col-start-auto lg:col-end-auto lg:row-start-auto lg:row-end-auto"
          ><img
            src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
            alt="Logo image"
        /></a>
        <div
         
          className="flex flex-col items-start justify-start"
        >
          <h2 className="mb-3 font-semibold md:mb-4">
            Column One
          </h2>
          <ul>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link One</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Two</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Three</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Four</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Five</a>
            </li>
          </ul>
        </div>
        <div
         
          className="flex flex-col items-start justify-start"
        >
          <h2 className="mb-3 font-semibold md:mb-4">
            Column Two
          </h2>
          <ul>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Six</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Seven</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Eight</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Nine</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Ten</a>
            </li>
          </ul>
        </div>
        <div
         
          className="flex flex-col items-start justify-start"
        >
          <h2 className="mb-3 font-semibold md:mb-4">
            Column Three
          </h2>
          <ul>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Eleven</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Twelve</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Thirteen</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Fourteen</a>
            </li>
            <li className="py-2 text-sm">
              <a href="#" className="flex items-center gap-3">Link Fifteen</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="mb-3 font-semibold md:mb-4">
          Subscribe
        </h1>
        <p className="mb-3 text-sm md:mb-4">
          Join our newsletter to stay up to date on features and releases.
        </p>
        <div className="w-full max-w-md">
          <form
            className="mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] md:gap-y-4"
          >
            <div className="relative flex w-full items-center">
              <input
                type="email"
                className="flex size-full min-h-11 border border-border-primary bg-background-primary py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-3"
                id="email"
                placeholder="Enter your email"
                value=""
              />
            </div>
            <button
              className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-5 py-2"
              title="Subscribe"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs">
            By subscribing you agree to with our Privacy Policy and provide
            consent to receive updates from our company.
          </p>
        </div>
      </div>
    </div>
    <div className="h-px w-full bg-black"></div>
    <div
      className="flex flex-col-reverse items-start pb-4 pt-6 text-sm md:justify-start md:pb-0 md:pt-8 lg:flex-row lg:items-center lg:justify-between"
    >
      <div
        className="flex flex-col-reverse items-start md:flex-row md:gap-6 lg:items-center"
      >
        <div
         
          className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 md:grid-flow-col md:justify-center md:gap-x-6 md:gap-y-0 lg:text-left"
        >
          <p className="mt-8 md:mt-0">
            © 2024 Relume. All rights reserved.
          </p>
          <p className="underline">
            <a href="#">Privacy Policy</a>
          </p>
          <p className="underline">
            <a href="#">Terms of Service</a>
          </p>
          <p className="underline">
            <a href="#">Cookies Settings</a>
          </p>
        </div>
      </div>
      <div
       
        className="mb-8 flex items-center justify-center gap-3 lg:mb-0"
      >
        <a href="#"
          ><svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"
            ></path></svg></a
        ><a href="#"
          ><svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"
            ></path>
            <circle cx="16.806" cy="7.207" r="1.078"></circle>
            <path
              d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"
            ></path></svg></a
        ><a href="#"
          ><svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            className="size-6 p-0.5"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
            ></path></svg></a
        ><a href="#"
          ><svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z"
            ></path></svg></a
        ><a href="#"
          ><svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z"
            ></path></svg
        ></a>
      </div>
    </div>
  </div>
</footer>

    </>
  );
}
