import { Box } from "@chakra-ui/react";
import HFTextField from "../../../../components/HFTextField";
import MainHeading from "../../../../components/MainHeading";
import { SectionCard } from "../../components/SectionCard";
import { FormSectionTitle } from "../../components/FormSectionTitle";
import styles from "./style.module.scss";
import { useReportProps } from "./useReportProps";

export const Report = () => {
  const { control } = useReportProps();

  return <div>
    <div className={styles.header}>
      <MainHeading size="18px">FMCSA Report</MainHeading>
    </div>
    <div className={styles.formSection}>
      <FormSectionTitle>USDOT information</FormSectionTitle>
      <SectionCard maxWidth="720px">
        <HFTextField
          control={control}
          name="entity_type"
          label="Entity type"
          placeholder="None"
          required
          disabled
        />
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gap="24px"
          mt="24px"
        >
          <HFTextField
            control={control}
            name="us_dot_number"
            label="USDOT"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="status"
            label="Status"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="state_carrier_id"
            label="State Carrier ID number"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="out_of_service_date"
            label="Out of service date"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            type="date"
            control={control}
            name="mcs_150_form_date"
            label="MCS-150 Form Date"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="mcs_150_year"
            label="MCS-150 Mileage (Year)"
            placeholder="None"
            required
            disabled
          />
        </Box>
      </SectionCard>
    </div>
    <div className={styles.formSection}>
      <FormSectionTitle>Operating authority information</FormSectionTitle>
      <SectionCard maxWidth="720px">
        <Box
          display="flex"
          flexDirection="column"
          gap="6px"
          mb="24px"
        >
          <HFTextField
            control={control}
            name="operating_status"
            label="Operating Authority Status"
            placeholder="None"
            required
            disabled
          />
          <p className={styles.infoText}>For Licensing and Insurance details <a href="#">click here</a></p>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="24px"
        >
          <HFTextField
            control={control}
            name="mc_number"
            label="MC/MX/FF Number(s)"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="legal_name"
            label="Legal Name"
            placeholder="None"
            required
            disabled
          />
        </Box>
      </SectionCard>
    </div>
    <div className={styles.formSection}>
      <FormSectionTitle>Company Information</FormSectionTitle>
      <SectionCard maxWidth="720px">
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gap="24px"
          mt="24px"
        >
          <HFTextField
            control={control}
            name="company_name"
            label="Legal Name"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="dba_name"
            label="DBA Name"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="physical_address"
            label="Physical Address"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="phone"
            label="Phone"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="mailing_address"
            label="Mailing Address"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="duns_number"
            label="DUNS Number"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="power_units"
            label="Power Units"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="non_cmv"
            label="Non-CMV Units"
            placeholder="None"
            required
            disabled
          />
          <HFTextField
            control={control}
            name="drivers"
            label="Drivers"
            placeholder="None"
            required
            disabled
          />
        </Box>
      </SectionCard>
    </div>
  </div>;
};
