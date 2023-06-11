'use client';
import React, { useEffect, useState, useContext } from 'react'
//internal import 
import { CrowdFundingContext } from '../Context/CroudFunding'
import { Hero, Card, Popup, PopUp } from '../Components'


const index = () => {

  const {
    titleData,
    getCampaigns,
    createCampaigns,
    donate,
    getUserCampaigns,
    getDonations,
  } = useContext(CrowdFundingContext);

  const [allcampaign, setAllCampaign] = useState();
  const [usercampaign, setUsercampaign] = useState();

  useEffect(() => {
    const getCampaignsData = getCampaigns();
    const userCampaignData = getUserCampaigns();
    return async () => {
      const allData = await getCampaignsData;
      const userData = await userCampaignData;
      setAllCampaign(allData);
      setUsercampaign(userData);


    }
  }, []);

  //Donate popup model
  const [openModel, setOpenModel] = useState(false);
  const[donateCampaign, setDonateCampaign] = useState();

  console.log(donateCampaign);
  return (
    <>
      <Hero titleData={titleData} createCampaigns={createCampaigns} />
      <Card title="All Listed Campaign"
        allcampaign={allcampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign} />
      <Card title="Your created campaigns"
        allcampaign={usercampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />

      {openModel && (
        <PopUp
          setOpenModel={setOpenModel}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate} />

      )}

    </>
  )
}

export default index