<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let autoClose = false;
	export let open = false;
	export let style = '';
	export let classes = '';

	function handleClose() {
		if (autoClose) {
			close();
		}
	}
	function close() {
		open = false;
	}
</script>

{#if open}
	<div class="backdrop" on:click={handleClose}>
		<div class="container {classes}" {style} on:click|stopPropagation>
			<div class="close" on:click={close}>
				<span class="material-symbols-outlined"> close </span>
			</div>
			<slot />
		</div>
	</div>
{/if}

<style>
	.backdrop {
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(255, 255, 255, 0.1);
		display: grid;
		place-items: center;
	}
	.container {
		position: relative;
        overflow: auto;
		padding: 16px;
		box-shadow: 0 0 3px #ccc;
		width: 100%;
		max-width: 80%;
		background-color: var(--primary);
		max-height: 80%;
		border-radius: 7px;
		box-shadow: 0 0 3px #ccc;
		animation: popup 175ms 1 ease-in-out;
	}
	.close {
        font-size: 2rem;
		padding: 0.5rem;
		line-height: 0;
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		cursor: pointer;
		user-select: none;
	}
	@keyframes popup {
		0% {
			transform: scale(0);
		}
		80% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
