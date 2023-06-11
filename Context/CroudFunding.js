"use client";
import React,{useState, useEffect} from "react";

import Web3Modal from "web3modal";

import {ethers} from "ethers";

//Internal import
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";

//---fetch smart contract
const fetchContract = (signerOrProvider) => 
    new ethers.Contract (CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({children}) => {
    const titleData = "Crowd Funding Contract";
    const [currentAccount, setCurrentAccount] = useState("")

    const createCampaign = async (campaign)=>{
        const {title, description, amount, deadline} = campaign;
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Modal(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);
        console.log(currentAccount);
        try{
            const transaction = await contract.createCampaign(
                currentAccount,//owner
                title,
                description,
                ethers.utils.parseUnits(amount, 18),
                new Date(deadline).getTime() //deadline

            );
            await transaction.wait();
            console.log("contract call successfully", transaction);
        }catch{
            console.log("contract call faliure" , error);

        }
    };

    const getCampaigns = async () => {
        const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/odJ8T7mOiJL4xC5rOMrxYSIGqgL54dLf");
        const contract = fetchContract(provider);
      
        try {
          const campaigns = await contract.getCampaigns(provider);
      
          const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(
              campaign.amountCollected.toString()
            ),
            pId: i,
          }));
      
          return parsedCampaigns;
        } catch (error) {
          console.log(error);
        }
      };

      const getUserCampaigns = async () => {
        const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/odJ8T7mOiJL4xC5rOMrxYSIGqgL54dLf");
        const contract = fetchContract(provider);
    
        const allCampaigns = await contract.getCampaigns(provider);
    
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const currentUser = accounts[0];
    
        const filteredCampaigns = allCampaigns.filter(
          (campaign) =>
            campaign.owner === currentUser || campaign.owner === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        );
    
        const userData = filteredCampaigns.map((campaign, i) => ({
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: ethers.utils.formatEther(campaign.target.toString()),
          deadline: campaign.deadline.toNumber(),
          amountCollected: ethers.utils.formatEther(
            campaign.amountCollected.toString()
          ),
          pId: i,
        }));
    
        return userData;
      };
    
    const donate = async (pId, amount) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        const campaignData = await contract.donateToCampaign(pId, {
            value:ethers.utils.parseEther(amount),

        });
        await campaignData.wait();
        location.reload();

        return campaignData;
    }

    const getDonations = async (pId)=>{
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);
        const donations = await contract.getDonations(pId);
        const numerOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i=0; i< numerOfDonations; i++){
            parsedDonations.push({
                donator: donations[0][i],
                donations: ethers.utils.formatEther(donations[1][i].toString()),

            });
        }
        return parsedDonations;
    };

    //check if all the fields are filled and if the user is a validator
    const checkIfWalletConnected = async ()=>{
        try{
            if(!window.ethereum)
            return setOpenError(true), setError("Install metamsak");

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if(accounts.length){
                setCurrentAccount(accounts[0]);
            }else{
                console.log('No account found');
            }
        }catch{
            console.log("something wrong while connecting to wallet");
        }
    }

    useEffect(()=>{
        checkIfWalletConnected();
    },[]);

    //connect wallet functions
    const connetWallet = async() =>{
        try{
            if(!window.ethereum) return console.log("Install metamask");

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);

        }catch(error){
            console.log("error while connecting wallet");

        }
    }

    return (
        <CrowdFundingContext.Provider 
            value={{
                titleData,
                currentAccount,
                createCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                connetWallet
            }}
            >
                {children}
            </CrowdFundingContext.Provider>
    )
}

