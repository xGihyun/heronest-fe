<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner/index";
  import "../app.css";
  let { children } = $props();
</script>

<Toaster closeButton richColors />

<main>
  <div class="px-5 pt-6">
    {@render children()}
  </div>
</main>
