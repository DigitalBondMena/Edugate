<!--
the main refernce navbar and footer will locatedi in home page ar and en

 -->

# This section explains Fawzy should provide data for responsive images that have multiple sizes (600x250, 900x400, 1200x500) to be rendered in the frontend.

@php
// Example data coming from controller or database
$imageBasePath = 'images/home/services/';
$imageName = 'service-image'; // change this per section
@endphp

<!-- Background Image -->

<img
  src="{{ asset($imageBasePath . $imageName . '_1200x500.webp') }}"
  srcset="
    {{ asset($imageBasePath . $imageName . '_600x250.webp') }} 600w,
    {{ asset($imageBasePath . $imageName . '_900x400.webp') }} 900w,
    {{ asset($imageBasePath . $imageName . '_1200x500.webp') }} 1200w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
  width="1200"
  height="500"
  class="absolute inset-0 w-full h-full object-cover"
  loading="lazy"
  alt="Background Image"
/>
