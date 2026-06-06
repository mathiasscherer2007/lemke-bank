<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div>
	<header class="bg-teal-500 p-4 text-white">
		<a href={resolve('/wallet/overview')} class="font-[Stack_Sans_Notch] text-3xl"
			>Lemke<b>Bank</b></a
		>
	</header>
	<main>
		<div>
			<div>
				<span>
					<p>Saldo atual</p>
					<p>ID da carteira: 123456</p>
				</span>
				<p>BL$ 30</p>
			</div>
            <div>
                <a href={resolve("/wallet/actions/pay")}>Realizar Pagamento</a>
                <a href={resolve("/wallet/overview/statement")}>Extrato</a>
            </div>
            <hr />
            <div>
                <p>Transações recentes</p>
                <ul>
                    <li>
                        <p>Ana P. Lemke</p>
                        <p>BL$ 10</p>
                    </li>
                    <li>
                        <p>Túlio L. Baségio</p>
                        <p>-BL$ 6</p>
                    </li>
                </ul>
            </div>
		</div>
	</main>
	<footer></footer>
</div>
