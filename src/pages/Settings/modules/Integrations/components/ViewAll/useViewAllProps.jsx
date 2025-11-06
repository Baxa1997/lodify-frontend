import { useEffect, useState } from "react";
import {
  useCreateIntegrationsMutation,
  useGetIntegrations,
  useUpdateIntegrationsMutation,
} from "../../../../services/integrations.service";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

const RESOURCES_MAP = {
  ELD: "ELD",
  SAMSARA: "SAMSARA",
  BLUE_YONDER: "BLUE_YONDER",
  MOTIVE: "MOTIVE",
};

const content = [
  {
    icon: "/img/fmcsa.png",
    title: "FMCSS",
    type: ["FMCSS"],
    description:
      "Federal Motor Carrier Safety System – government database integration for compliance, carrier safety records, and DOT checks.",
  },
  {
    icon: "/img/stripe.svg",
    title: "FACTOR ELD",
    type: [RESOURCES_MAP.ELD],
    description:
      "Online payment processing platform for freight billing, invoicing, and secure transactions.",
  },
  {
    icon: "/img/samsara.png",
    title: "Samsara",
    type: [RESOURCES_MAP.SAMSARA],
    description:
      "Electronic Logging Device (ELD) and telematics integration for driver hours, fleet tracking, and compliance reporting.",
  },
  {
    icon: "/img/gomotive.jpg",
    title: "Motive",
    type: [RESOURCES_MAP.MOTIVE],
    description:
      "Streamline your business operations with the all-in-one solution.",
  },
  {
    icon: "/img/blue-yonder.png",
    title: "Blue Yonder",
    type: [RESOURCES_MAP.BLUE_YONDER],
    description:
      "Transportation Management System for supply chain optimization, load planning, and freight execution.",
  },
  {
    icon: "/img/sumsub.png",
    title: "SumSub",
    type: ["SUMSUB"],
    description:
      "Digital identity verification and liveness detection service for secure onboarding and fraud prevention.",
  },
  {
    icon: "/img/firebase.png",
    title: "Firebase SMS Auth",
    type: ["Firebase SMS Auth"],
    description:
      "Google Firebase authentication via SMS OTP for secure user login and access control.",
  },
  {
    icon: "/img/mailchimp.svg",
    title: "Mailchimp",
    type: ["Mailchimp"],
    description:
      "Email automation and SMTP integration for notifications, marketing campaigns, and transactional emails.",
  },
  {
    icon: "/img/google-map.svg",
    title: "Google Maps API",
    type: ["Google Maps API"],
    description: "Plan, track, and release great software.",
  },
];

export const useViewAllProps = () => {
  const { companies_id: companyId, guid } = useSelector(
    (state) => state.auth.user_data,
  );

  const companies_id = companyId || guid;

  const toast = useToast();

  const [resources, setResources] = useState(content);

  const [isResourceOpen, setIsResourceOpen] = useState(null);
  const [isResourceDetailOpen, setIsResourceDetailOpen] = useState(null);

  const [currentContent, setCurrentContent] = useState(null);

  const { handleSubmit, register, reset } = useForm();

  const handleSetCurrentContent = (content) => setCurrentContent(content);

  const handleOpenResource = (content) => {
    if (content?.type?.[0] === RESOURCES_MAP.ELD) {
      reset({
        username: content?.username,
        password: content?.password,
        api_key: content?.api_key,
      });
    } else if (content?.type?.[0] === RESOURCES_MAP.SAMSARA) {
      reset({
        api_key: content?.api_key,
      });
    } else if (content?.type?.[0] === RESOURCES_MAP.MOTIVE) {
      reset({
        api_key: content?.api_key,
      });
    } else {
      reset({});
    }
    setIsResourceOpen(true);
    setCurrentContent(content);
  };

  const handleCloseResource = () => {
    reset({});
    setIsResourceOpen(false);
    setCurrentContent(null);
  };

  const handleOpenResourceDetail = (content) => {
    setIsResourceDetailOpen(true);
    setCurrentContent(content);
  };

  const handleCloseResourceDetail = () => {
    setIsResourceDetailOpen(false);
    setCurrentContent(null);
  };

  const { data, refetch } = useGetIntegrations({}, companies_id);

  const checkedTypes = data?.response?.map((item) => item?.type?.[0]);

  const onSuccess = () => {
    handleCloseResource();
    refetch();
    toast({
      position: "top right",
      title: "Successfully updated",
      status: "success",
    });
  };

  const onError = (error) => {
    toast({
      position: "top right",
      title: "Something went wrong",
      description: error?.data?.description,
      status: "error",
    });
  };

  const handleUpdateIntegration = useUpdateIntegrationsMutation({
    onSuccess,
    onError,
  });
  const handleCreateIntegration = useCreateIntegrationsMutation({
    onSuccess,
    onError,
  });

  const onSubmit = (data) => {
    if (currentContent.guid) {
      handleUpdateIntegration.mutate({
        data: {
          ...data,
          guid: currentContent.guid,
          companies_id,
          type: currentContent.type,
          status: true,
        },
      });
    } else {
      handleCreateIntegration.mutate({
        data: { ...data, companies_id, type: currentContent.type, status: true },
      });
    }
  };

  const handleChange = (e, item) => {
    if (
      item.type?.[0] !== RESOURCES_MAP.ELD &&
      item.type?.[0] !== RESOURCES_MAP.SAMSARA &&
      item.type?.[0] !== RESOURCES_MAP.MOTIVE
    ) {
      e.preventDefault();
      return;
    }

    if (item.status) {
      handleUpdateIntegration.mutate({ data: { ...item, status: false } });
    } else {
      e.preventDefault();
      handleOpenResource(item);
    }
  };

  useEffect(() => {
    if (data?.response) {
      setResources((prev) =>
        prev.map((item) => {
          const createdResource = data?.response?.find((el) => {
            return el?.type?.[0] === item?.type[0];
          });

          if (createdResource) {
            return {
              ...item,
              ...createdResource,
            };
          }
          return item;
        }),
      );
    }
  }, [data]);

  return {
    RESOURCES_MAP,
    checkedTypes,
    resources,
    currentContent,
    isResourceOpen,
    isResourceDetailOpen,
    handleSetCurrentContent,
    handleOpenResource,
    handleCloseResource,
    onSubmit,
    handleOpenResourceDetail,
    handleCloseResourceDetail,
    handleSubmit,
    register,
    handleChange,
  };
};
