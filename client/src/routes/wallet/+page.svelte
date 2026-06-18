<script>
    import { resolve } from "$app/paths";
    import { redirect } from "@sveltejs/kit";

    throw redirect(308, resolve("/wallet/overview"));
</script>

<!-- Nothing to see here! -->