<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';
	
	import warningIcon from '$lib/assets/icons/warning.svg';
	import eyeIcon from '$lib/assets/icons/eye.svg';
	import crossedEyeIcon from '$lib/assets/icons/eye-crossed.svg';

	import { slide } from 'svelte/transition';

	let { form }: PageProps = $props();

	let submitting = $state(false);
	let warningVisible = $state(true);
	let showPassword = $state(false);
	let passwordContent = $state();

	function hideError() {
		warningVisible = false;
	}

	function toggleShowPassword() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Sign Up | LemkeBank</title>
</svelte:head>

<div class="flex h-screen w-screen items-center justify-center dark:bg-[rgb(46,46,45)] relative overflow-hidden">
	<h2 class="absolute left-5 top-5 text-teal-500 dark:text-teal-400 font-[Stack_Sans_Notch] text-4xl">Lemke<b>Bank</b></h2>
	<div class="h-full flex items-center justify-center w-full">
		<form
			use:enhance={() => {
				submitting = true;

				return async ({ update }) => {
					await update();
					submitting = false;
					warningVisible = true;
					passwordContent = "";
				};
			}}
			action="?/signup"
			method="POST"
			class="m-auto flex w-xl flex-col items-center rounded-xl p-5 px-7 bg-[rgb(27,27,26)] dark:text-white"
		>
			<h1 class="py-5 pb-7 font-[Stack_Sans_Headline] text-4xl font-bold">Welcome Aboard</h1>
			{#if form?.error?.message && !submitting && warningVisible}
				<div
					in:slide
					out:slide
					class="mb-3 flex w-full flex-row items-center gap-3 rounded-xl border border-orange-400 text-orange-400 p-3"
				>
					<img src={warningIcon} alt="" class="orange-filter aspect-square w-10" />
					{form.error.message}
					<button type="button" onclick={hideError} class="ml-auto cursor-pointer p-1">X</button>
				</div>
			{/if}
			<div class="my-2 flex w-full flex-col">
				<label for="username" class="pl-1">Username</label>
				<input
					type="text"
					name="username"
					id="username"
					autocomplete="off"
					required
					class="rounded-xl p-3 bg-[rgb(46,46,45)] autofill:bg-[rgb(36,36,35)]"
				/>
			</div>
			<div class="my-2 flex w-full flex-col">
				<label for="email" class="pl-1">E-mail</label>
				<input
					type="email"
					name="email"
					id="email"
					autocomplete="off"
					placeholder="example@email.com"
					required
					class="rounded-xl p-3 bg-[rgb(46,46,45)] autofill:bg-[rgb(36,36,35)]"
				/>
			</div>
			<div class="my-2 flex w-full flex-col">
				<label for="password" class="pl-1">Password</label>
				<div class="relative flex">
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						id="password"
						bind:value={passwordContent}
						required
						class="flex-1 rounded-xl p-3 bg-[rgb(46,46,45)] autofill:bg-[rgb(36,36,35)]"
					/>
					<button type="button" onclick={toggleShowPassword} class="absolute right-0 h-full cursor-pointer p-2">
						<img src={showPassword ? crossedEyeIcon : eyeIcon} alt="show" class="h-full" />
					</button>
				</div>
			</div>
			<div class="my-2 flex w-full flex-col pt-6">
				<button
					disabled={submitting}
					class="cursor-pointer rounded-xl p-3 font-bold transition bg-teal-500 dark:bg-teal-400 dark:text-black disabled:cursor-default dark:disabled:bg-transparent border dark:border-teal-400 dark:disabled:text-teal-400 dark:hover:bg-teal-500"
					>{submitting ? "..." : "Sign Up"}</button
				>
				<span class="flex w-full flex-col items-center pt-5">
					<p>
						Already have an account? <a
							href={resolve("/account/login")}
							class="underline text-teal-500 dark:text-teal-400">Log In</a
						>
					</p>
				</span>
			</div>
		</form>
	</div>
</div>
