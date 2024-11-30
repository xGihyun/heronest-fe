<script lang="ts">
	let { data } = $props();
</script>

<div>
    Name: {data.user?.first_name}
    {data.user?.last_name}
    {data.user?.role}

    <br>

    Display other info.
</div>
