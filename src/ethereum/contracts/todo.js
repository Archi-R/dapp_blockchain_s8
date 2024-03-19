import { ethers } from 'ethers';

// Importez l'ABI de votre contrat
import contractABI from '../path/to/YourContractABI.json';

const contractAddress = 'VotreAdresseDeContrat';

export class todo {
    constructor() {
        this.init();
    }

    async init() {
        // Initialiser ethers avec le provider de Metamask
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.contract = new ethers.Contract(contractAddress, contractABI, this.provider.getSigner());
    }

    async fetchTaskCount() {
        return await this.contract.taskCount();
        console.log("truc");
    }

    async createNewTask(content) {
        const transactionResponse = await this.contract.createTask(content);
        await transactionResponse.wait(); // Attendre la confirmation
    }

    // Ajoutez d'autres fonctions nécessaires pour interagir avec le contrat
}