<script>
	import * as XLSX from 'xlsx';
  import {processDataForGLS} from '../lib/process_data_gls'
	import 'bootstrap/dist/css/bootstrap.css';
  import logo from '../assets/logo.png';


	let isDragging = false;
	let data = [];

	function processWorksheet(worksheet) {
		let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
		for (let i = 0; i < data.length; i++) {
			data[i].push('');
			data[i].push('');
		}
		return data;
	}

	function handleFileUpload(event) {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			const fileData = reader.result;
			const workbook = XLSX.read(fileData, { type: 'binary' });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			data = processWorksheet(worksheet);
		};
		reader.readAsBinaryString(file);
	}

	function handleDragOver(event) {
		event.preventDefault();
	}

	function handleDrop(event) {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			const fileData = reader.result;
			const workbook = XLSX.read(fileData, { type: 'binary' });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			data = processWorksheet(worksheet);
		};
		reader.readAsBinaryString(file);
	}

	function handlePackageInput(event, row) {
		const packageNum = event.target.value;
		data[row][9] = packageNum;
	}

	function handleWeightInput(event, row) {
		const weight = event.target.value;
		data[row][10] = weight;
	}

	function handleExport() {
    const processedData = processDataForGLS(data)
    const csvData = processedData.map(row => row.join(";")).join('\n')
		const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'data.csv';
		link.click();
	}
</script>

<div class="navbar d-flex align-items-center bg-light ">
  <div class="container">
    <a class="navbar-brand" href="#">
      <img src={logo} alt="Logo" width="70" height="70" />
    </a>
    <div class="text-end col-5">
      <h4 class="mb-0">Odoo > GLS</h4>
      <p class="mb-0"><small>Permet de transformer l'export Odoo des bons de livraison dans un format importable dans GLS Label lite online.</small></p>
    </div>
  </div>
</div>

<div class="container mt-4">
  <div class="row">
    <h3>Marche à suivre</h3>
    <div>
    <ol>
      <li>Dans Odoo, exportez le fichier excel avec toutes les livraisons à effectuer (<a href="https://aip-sutures.odoo.com/web#id=16&cids=1&menu_id=416&action=622&model=knowledge.article&view_type=form" target="_blank">voir ici comment faire)</a></li>
      <li>Importez le fichier excel ci-dessous</li>
      <li>Complétez le tableau avec le nombre de colis et le poids total des colis</li>
      <li>Téléchargez le fichier CSV grâce au bouton situé en dessous du tableau</li>
      <li>Importez ce fichier CSV dans <a href="https://services.gls-belgium.com/LLonline/index.php" target="_blank">GLS Label lite online</a></li>
      <li>Imprimez les étiquettes et transmettez les livraisons</li>
    </ol>
  </div>
</div>
	<div class="row">
    <h3>Importer le fichier excel d'Odoo</h3>

		<div class="col-md-12">
			<div
				id="file-dropzone"
				class="dropzone text-center p-5"
				class:active={isDragging}
				on:dragover={handleDragOver}
				on:dragenter={() => (isDragging = true)}
				on:dragleave={() => (isDragging = false)}
				on:drop={handleDrop}
			>
				<p class="mb-3">Glissez le fichier excel ici</p>
				<label for="file-input" class="btn btn-primary mb-0"> Ou cliquez pour importer le fichier</label>
				<input id="file-input" type="file" on:change={handleFileUpload} class="d-none" />
			</div>
		</div>
	</div>
	{#if data.length > 0}

	<div class="table-responsive mt-4">
    <h3>Complétez le tableau</h3>
	<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
		
		<symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
		  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
		</symbol>
	
	  </svg>
	  
	  <div class="alert alert-warning d-flex align-items-center mt-4" role="alert">
		<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
		<div>
		  Utilisez la touche du clavier <kbd>Tab ⇥</kbd> pour passer d'une cellule à l'autre. Ou <kbd>Shift ⇧</kbd> + <kbd>Tab ⇥</kbd> pour revenir à la cellule précédente.
		</div>
	  </div>
				<table class="table table-bordered">
					<thead>
						<tr>
							<th>Bon de livraison</th>
							<th>Client</th>
							<th>Nombre de colis</th>
							<th>Poids total des colis</th>
						</tr>
					</thead>
					<tbody>
						{#each data as row, i}
							{#if i !== 0}
								<tr>
									<td>{row[0]}</td>
									<td>{row[1]}</td>
									<td>
										<input
											type="number"
											value={row[2]}
											on:change={(e) => handlePackageInput(e, i)}
											class="form-control"
										/>
									</td>
									<td>
										<input
											type="number"
											value={row[3]}
											on:change={(e) => handleWeightInput(e, i)}
											class="form-control"
										/>
									</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
      </div>  
		<div class="row mb-4">
			<div class="col-md-12 text-end mb-3">
				<button class="btn btn-primary btn-lg px-4" on:click={handleExport}>Export to CSV</button>
			</div>
		</div>
	{/if}
</div>

<style>
	#file-dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 200px;
		border: 2px dashed #ccc;
		border-radius: 10px;
	}

	#file-dropzone.active {
		border-color: #000;
	}

	#file-dropzone p {
		margin: 0;
	}

	input[type='number'] {
		width: 100%;
	}

	.export-button {
		display: block;
		margin: 20px auto;
		padding: 10px 20px;
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.export-button:hover {
		background-color: #0069d9;
	}
</style>
