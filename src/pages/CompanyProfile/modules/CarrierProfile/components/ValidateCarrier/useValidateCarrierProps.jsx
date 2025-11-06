export const useValidateCarrierProps = () => {

  const headData = [
    {
      label: "Requested By",
      key: "requestedBy",
    },
    {
      label: "Requester Email",
      key: "requesterEmail",
    },
    {
      label: "First Name",
      key: "firstName",
    },
    {
      label: "Last Name",
      key: "lastName",
    },
    {
      label: "Title",
      key: "title",
    },
    {
      label: "Phone Number",
      key: "phoneNumber",
    },
    {
      label: "Email",
      key: "email",
    },
  ];

  const bodyData = [
    {
      requestedBy: "John Doe",
      requesterEmail: "jdoe@me.com",
      firstName: "John",
      lastName: "Doe",
      title: "Manager",
      phoneNumber: "123-456-7890",
      email: "jdoe@me.com",
    },
    {
      requestedBy: "John Doe",
      requesterEmail: "jdoe@me.com",
      firstName: "John",
      lastName: "Doe",
      title: "Manager",
      phoneNumber: "123-456-7890",
      email: "jdoe@me.com",
    },
    {
      requestedBy: "John Doe",
      requesterEmail: "jdoe@me.com",
      firstName: "John",
      lastName: "Doe",
      title: "Manager",
      phoneNumber: "123-456-7890",
      email: "jdoe@me.com",
    },
  ];

  return {
    headData,
    bodyData,
  };
};
