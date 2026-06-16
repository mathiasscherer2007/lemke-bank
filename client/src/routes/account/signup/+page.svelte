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
	<title>Criar Conta | LemkeBank</title>
</svelte:head>

<div class="flex lg:flex-row h-screen w-screen items-start pt-30 lg:pt-0 lg:items-center justify-center bg-[#e0e9e780] dark:bg-[rgb(45,46,45)] relative">
	<h2 class="absolute left-5 top-5 text-teal-500 dark:text-teal-400 font-[Stack_Sans_Notch] text-3xl lg:text-4xl">Lemke<b>Bank</b></h2>
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
		class="mx-5 lg:mx-auto flex w-xl flex-col items-center rounded-xl p-5 px-7 bg-[#fbfafb] dark:bg-[rgb(27,27,26)] shadow dark:text-white"
	>
		<h1 class="py-3 lg:py-5 pb-5 lg:pb-7 font-[Stack_Sans_Headline] text-2xl lg:text-4xl font-bold">Criar Conta</h1>
		{#if form?.error?.message && !submitting && warningVisible}
			<div
				in:slide
				out:slide
				class="mb-3 flex w-full flex-row items-center gap-3 rounded-xl border border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 p-3"
			>
				<img src={warningIcon} alt="" class="orange-filter aspect-square w-10" />
				{form.error.message}
				<button type="button" onclick={hideError} class="ml-auto cursor-pointer p-1">X</button>
			</div>
		{/if}
		<div class="my-2 flex w-full flex-col">
			<label for="username" class="pl-1">Nome de Usuário</label>
			<input
				type="text"
				name="username"
				id="username"
				autocomplete="off"
				required
				class="rounded-xl p-3 bg-[#efefef] dark:bg-[rgb(46,46,45)]"
			/>
		</div>
		<div class="my-2 flex w-full flex-col">
			<label for="email" class="pl-1">Email</label>
			<input
				type="email"
				name="email"
				id="email"
				autocomplete="off"
				placeholder="exemplo@email.com"
				required
				class="flex-1 rounded-xl p-3 bg-[#efefef] dark:bg-[rgb(46,46,45)]"
			/>
		</div>
		<div class="my-2 flex w-full flex-col">
			<label for="password" class="pl-1">Senha</label>
			<div class="relative flex">
				<input
					type={showPassword ? "text" : "password"}
					name="password"
					id="password"
					bind:value={passwordContent}
					required
					class="flex-1 rounded-xl p-3 bg-[#efefef] dark:bg-[rgb(46,46,45)]"
				/>
				<button
					type="button"
					onclick={toggleShowPassword}
					class="absolute right-0 h-full cursor-pointer p-2"
					aria-label={showPassword ? 'Hide password' : 'Show password'}
				>
					<img src={showPassword ? crossedEyeIcon : eyeIcon} alt="show" class="h-full white-filter" />
				</button>
			</div>
		</div>
		<div class="my-2 flex w-full flex-col pt-6">
			<button
				disabled={submitting}
				class="cursor-pointer rounded-xl p-3 font-bold transition bg-teal-400 dark:text-black disabled:cursor-default disabled:bg-transparent border border-teal-400 disabled:text-teal-400 dark:hover:bg-teal-500"
				>{submitting ? "..." : "Criar Conta"}</button
			>
			<span class="flex w-full flex-col items-center pt-5">
				<p>
					Já tem uma conta? <a
						href={resolve("/account/login")}
						class="underline text-teal-500 dark:text-teal-400 font-semibold">Entrar</a
					>
				</p>
			</span>
		</div>
	</form>
</div>
