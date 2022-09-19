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
		dispatch("close")
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
		padding: 1.5rem 1rem;
		box-shadow: 0 0 3px #ccc;
		width: 80%;
		max-width: 600px;
		background-color: var(--primary);
		height: 100%;
		max-height: 85%;
		border-radius: 7px;
		box-shadow: 0 0 3px #ccc;
		animation: popup 175ms 1 ease-in-out;
	}
	.close {
        font-size: 2rem;
		padding: 0.5rem;
		line-height: 0;
		position: absolute;
		z-index: 1;
		top: 0.5rem;
		right: 0.5rem;
		cursor: pointer;
		user-select: none;
	}
	@media screen and (max-width: 1024px) {
		.container {
			width: 100%;
			height: 100%;
			max-width: none;
			max-height: none;
		}
	}
	@keyframes popup {
		0% {
			transform: scaleY(0);
		}
		70% {
			transform: scaleY(1.1);
		}
		100% {
			transform: scaleY(1);
		}
	}
</style>
