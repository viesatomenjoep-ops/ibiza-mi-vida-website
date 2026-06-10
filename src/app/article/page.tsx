import React from 'react';

export default function ArticlePage() {
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

<link
  rel="preload"
  as="image"
  href="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
/>
<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div className="container">
    <div
     
      className="mx-auto mb-12 flex w-full max-w-lg flex-col items-start justify-start md:mb-16 lg:mb-20"
    >
      <nav
        aria-label="breadcrumb"
       
        className="mb-6 flex w-full items-center"
      >
        <ol
          className="flex flex-wrap items-center gap-1.5 break-words text-text-primary sm:gap-2"
        >
          <li className="inline-flex items-center gap-1.5">
            <a className="" href="#">Blog</a>
          </li>
          <li
            role="presentation"
            aria-hidden="true"
            className="text-text-primary [&amp;&gt;svg]:size-4"
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="0"
              viewBox="0 0 15 15"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                fill="currentColor"
              ></path>
            </svg>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <a className="" href="#">Category</a>
          </li>
        </ol>
      </nav>
      <h1
       
        className="mb-8 text-5xl font-bold md:mb-10 md:text-7xl lg:mb-12 lg:text-8xl"
      >
        Blog title heading will go here
      </h1>
      <div
       
        className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-end"
      >
        <div
         
          className="rb-4 mb-4 flex items-center sm:mb-0"
        >
          <div
           
            className="mr-4 shrink-0"
          >
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              alt="Relume placeholder avatar"
              className="size-14 min-h-14 min-w-14 rounded-full object-cover"
            />
          </div>
          <div
           
           
          >
            <h6 className="font-semibold">Full name</h6>
            <div
             
             
              className="mt-1 flex"
            >
              <p className="text-sm">11 Jan 2022</p>
              <span className="mx-2"
                >•</span
              >
              <p className="text-sm">5 min read</p>
            </div>
          </div>
        </div>
        <div
         
          className="rt-4 mt-4 grid grid-flow-col grid-cols-[max-content] items-start gap-2"
        >
          <a
            href="#"
            className="rounded-[1.25rem] bg-background-secondary p-1"
           
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
                d="M4.222 19.778a4.983 4.983 0 0 0 3.535 1.462 4.986 4.986 0 0 0 3.536-1.462l2.828-2.829-1.414-1.414-2.828 2.829a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.829-2.828-1.414-1.414-2.829 2.828a5.006 5.006 0 0 0 0 7.071zm15.556-8.485a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0L9.879 7.051l1.414 1.414 2.828-2.829a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.829 2.828 1.414 1.414 2.829-2.828z"
              ></path>
              <path
                d="m8.464 16.95-1.415-1.414 8.487-8.486 1.414 1.415z"
              ></path></svg></a
          ><a
            href="#"
            className="rounded-[1.25rem] bg-background-secondary p-1"
           
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
          ><a
            href="#"
            className="rounded-[1.25rem] bg-background-secondary p-1"
           
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
          ><a
            href="#"
            className="rounded-[1.25rem] bg-background-secondary p-1"
           
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
              ></path></svg
          ></a>
        </div>
      </div>
    </div>
    <div className="mx-auto w-full overflow-hidden">
      <img
        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
        className="aspect-[2] size-full object-cover"
        alt="Relume placeholder image"
      />
    </div>
  </div>
</section>

<link
  rel="preload"
  as="image"
  href="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
/><link
  rel="preload"
  as="image"
  href="https://cdn.prod.website-files.com/624380709031623bfe4aee60/6243807090316203124aee66_placeholder-image.svg"
/>
<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div className="container">
    <div className="mx-auto max-w-lg">
      <div
       
        className="mb-14 flex flex-col gap-y-8 sm:flex-row sm:items-center sm:justify-between md:mb-16 md:gap-y-0"
      >
        <nav aria-label="breadcrumb" className="flex items-center">
          <ol
            className="flex flex-wrap items-center gap-1.5 break-words text-text-primary sm:gap-2"
          >
            <li className="inline-flex items-center gap-1.5">
              <a className="" href="#">Blog</a>
            </li>
            <li
              role="presentation"
              aria-hidden="true"
              className="text-text-primary [&amp;&gt;svg]:size-4"
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="0"
                viewBox="0 0 15 15"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                ></path>
              </svg>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <a className="" href="#">Category</a>
            </li>
          </ol>
        </nav>
        <div className="flex items-start gap-2">
          <a
            href="#"
            className="size-8 rounded-[1.25rem] bg-background-secondary p-1"
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
                d="M4.222 19.778a4.983 4.983 0 0 0 3.535 1.462 4.986 4.986 0 0 0 3.536-1.462l2.828-2.829-1.414-1.414-2.828 2.829a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.829-2.828-1.414-1.414-2.829 2.828a5.006 5.006 0 0 0 0 7.071zm15.556-8.485a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0L9.879 7.051l1.414 1.414 2.828-2.829a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.829 2.828 1.414 1.414 2.829-2.828z"
              ></path>
              <path
                d="m8.464 16.95-1.415-1.414 8.487-8.486 1.414 1.415z"
              ></path></svg></a
          ><a
            href="#"
            className="size-8 rounded-[1.25rem] bg-background-secondary p-1"
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
          ><a
            href="#"
            className="size-8 rounded-[1.25rem] bg-background-secondary p-1"
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
          ><a
            href="#"
            className="size-8 rounded-[1.25rem] bg-background-secondary p-1"
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
              ></path></svg
          ></a>
        </div>
      </div>
      <div
       
        className="prose mb-12 md:prose-md lg:prose-lg md:mb-16 lg:mb-20"
      >
        <h3>Introduction</h3>
        <p>
          Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
          suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis
          montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere
          vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien
          varius id.
        </p>
        <p>
          Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat
          mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis
          fusce augue enim. Quis at habitant diam at. Suscipit tristique risus,
          at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet
          sodales id est ac volutpat.
        </p>
        <figure>
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
            alt="Relume placeholder image"
          />
          <figcaption>Image caption goes here</figcaption>
        </figure>
        <h6>
          Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla
          odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis
          mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.
        </h6>
        <p>
          Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet
          commodo consectetur convallis risus. Sed condimentum enim dignissim
          adipiscing faucibus consequat, urna. Viverra purus et erat auctor
          aliquam. Risus, volutpat vulputate posuere purus sit congue convallis
          aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque
          ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget
          nunc lectus in tellus, pharetra, porttitor.
        </p>
        <blockquote>
          &quot;Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim
          mauris id. Non pellentesque congue eget consectetur turpis. Sapien,
          dictum molestie sem tempor. Diam elit, orci, tincidunt aenean
          tempus.&quot;
        </blockquote>
        <p>
          Tristique odio senectus nam posuere ornare leo metus, ultricies.
          Blandit duis ultricies vulputate morbi feugiat cras placerat elit.
          Aliquam tellus lorem sed ac. Montes, sed mattis pellentesque suscipit
          accumsan. Cursus viverra aenean magna risus elementum faucibus
          molestie pellentesque. Arcu ultricies sed mauris vestibulum.
        </p>
        <h4>Conclusion</h4>
        <p>
          Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id
          scelerisque est ultricies ultricies. Duis est sit sed leo nisl,
          blandit elit sagittis. Quisque tristique consequat quam sed. Nisl at
          scelerisque amet nulla purus habitasse.
        </p>
        <p>
          Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas
          condimentum mi massa. In tincidunt pharetra consectetur sed duis
          facilisis metus. Etiam egestas in nec sed et. Quis lobortis at sit
          dictum eget nibh tortor commodo cursus.
        </p>
        <p>
          Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce aliquet.
          Nam elementum urna nisi aliquet erat dolor enim. Ornare id morbi eget
          ipsum. Aliquam senectus neque ut id eget consectetur dictum. Donec
          posuere pharetra odio consequat scelerisque et, nunc tortor.Nulla
          adipiscing erat a erat. Condimentum lorem posuere gravida enim posuere
          cursus diam.
        </p>
      </div>
      <div
       
       
      >
        <div
         
         
          className="mb-8 text-center md:mb-10 lg:mb-12"
        >
          <p className="font-semibold md:text-md">
            Share this post
          </p>
          <div
           
            className="mb-8 mt-3 flex items-start justify-center gap-2 sm:mb-0 md:mt-4"
          >
            <a
              href="#"
              className="size-8 rounded-[1.25rem] bg-background-secondary p-1"
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
                  d="M4.222 19.778a4.983 4.983 0 0 0 3.535 1.462 4.986 4.986 0 0 0 3.536-1.462l2.828-2.829-1.414-1.414-2.828 2.829a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.829-2.828-1.414-1.414-2.829 2.828a5.006 5.006 0 0 0 0 7.071zm15.556-8.485a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0L9.879 7.051l1.414 1.414 2.828-2.829a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.829 2.828 1.414 1.414 2.829-2.828z"
                ></path>
                <path
                  d="m8.464 16.95-1.415-1.414 8.487-8.486 1.414 1.415z"
                ></path></svg></a
            ><a
              href="#"
              className="size-8 rounded-[1.25rem] bg-background-secondary p-1"
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
            ><a
              href="#"
              className="size-8 rounded-[1.25rem] bg-background-secondary p-1"
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
            ><a
              href="#"
              className="size-8 rounded-[1.25rem] bg-background-secondary p-1"
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
                ></path></svg
            ></a>
          </div>
        </div>
        <div>
          <ul
           
            className="flex flex-wrap justify-center gap-2"
          >
            <li className="flex">
              <a
                href="#"
                className="bg-background-secondary px-2 py-1 text-sm font-semibold"
                >Tag one</a
              >
            </li>
            <li className="flex">
              <a
                href="#"
                className="bg-background-secondary px-2 py-1 text-sm font-semibold"
                >Tag two</a
              >
            </li>
            <li className="flex">
              <a
                href="#"
                className="bg-background-secondary px-2 py-1 text-sm font-semibold"
                >Tag three</a
              >
            </li>
            <li className="flex">
              <a
                href="#"
                className="bg-background-secondary px-2 py-1 text-sm font-semibold"
                >Tag four</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div
       
        className="my-8 h-px bg-border-primary md:my-10 lg:my-12"
      ></div>
      <div
       
        className="flex flex-col items-center gap-4 text-center"
      >
        <div>
          <img
            src="https://cdn.prod.website-files.com/624380709031623bfe4aee60/6243807090316203124aee66_placeholder-image.svg"
            alt="Logo"
            className="size-14 rounded-full object-cover"
          />
        </div>
        <div className="grow">
          <p className="font-semibold md:text-md">Full name</p>
          <p>Job title, Company name</p>
        </div>
      </div>
    </div>
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
          &quot;The precision of Ibizamivida&#x27;s service matched the beauty
          of the island itself—everything arrived exactly as promised, nothing
          wasted, nothing excessive.&quot;
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
            <p className="font-semibold">Marcus Delgado</p>
            <p>Luxury travel curator</p>
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

<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div className="container">
    <div
     
      className="flex flex-col items-center border border-border-primary p-8 md:p-12 lg:p-16"
    >
      <div
       
       
        className="max-w-lg text-center"
      >
        <h2
         
          className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl"
        >
          Medium length heading goes here
        </h2>
        <p className="md:text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique.
        </p>
      </div>
      <div className="mx-auto mt-6 max-w-sm md:mt-8">
        <form
          className="rb-4 mb-4 grid max-w-sm grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4"
        >
          <div className="relative flex w-full items-center">
            <input
              type="email"
              className="flex size-full min-h-11 border border-border-primary bg-background-primary py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-3"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <button
            className="focus-visible:ring-border-primary inline-flex gap-3 whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary bg-background-alternative text-text-alternative items-center justify-center px-6 py-3"
            title="Sign up"
          >
            Sign up
          </button>
        </form>
        <p className="text-xs">
          By clicking Sign Up you&#x27;re confirming that you agree with our
          Terms and Conditions.
        </p>
      </div>
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
