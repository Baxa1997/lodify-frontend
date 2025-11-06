import { useGetTable } from "@services/items.service";
import { useSelector } from "react-redux";


export const useDocumentsTabProps = () => {

  const DOC_TYPES = {
    driver: "Driver",
    asset: "Asset",
    trip: "Trip",
  };

  const { companies_id: companyId, guid } = useSelector(state => state.auth.user_data);

  const companies_id = companyId || guid;

  const { data } = useGetTable("docs", {}, { data: JSON.stringify({ companies_id, doc_type: [DOC_TYPES.driver] }) });

  const dataResponse = data?.response;

  const handleDownload = async (fileUrl) => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "file.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  
    URL.revokeObjectURL(url);
  };
  


  const handleDownloadFiles = () => {
    dataResponse.forEach(({ file }) => {
      handleDownload(file);
    });
  };

  return {
    data: dataResponse,
    handleDownloadFiles,
  };
};
