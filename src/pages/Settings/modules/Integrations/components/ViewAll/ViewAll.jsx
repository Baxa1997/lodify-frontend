import { Switch } from "@chakra-ui/react";
import styles from "./style.module.scss";
import { useViewAllProps } from "./useViewAllProps";
import { ResourceDialog } from "../ResourceDialog";
import { MotiveResources } from "../MotiveDialog";

export const ViewAll = () => {
  const {
    RESOURCES_MAP,
    resources,
    currentContent,
    isResourceOpen,
    handleOpenResource,
    handleCloseResource,
    onSubmit,
    handleSubmit,
    register,
    handleChange,
  } = useViewAllProps();

  return (
    <div className={styles.viewAllContainer}>
      <div className={styles.viewList}>
        {resources.map((item) => (
          <div
            className={styles.viewCard}
            key={item.title}>
            <div className={styles.header}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>
                  <img
                    src={item.icon}
                    alt={item.title}
                    width="48px"
                    height="48px"
                  />
                </div>
                <div className={styles.logoName}>{item.title}</div>
              </div>
              <Switch
                name={item.type}
                isChecked={!!item?.status}
                onChange={(e) => handleChange(e, item)}
              />
            </div>
            <div className={styles.body}>
              <p className={styles.description}>{item.description}</p>
            </div>
            <div className={styles.footer}>
              <button
                className={styles.viewButton}
                onClick={() => {
                  if (
                    item.type[0] === RESOURCES_MAP.ELD ||
                    item.type[0] === RESOURCES_MAP.SAMSARA ||
                    item.type[0] === RESOURCES_MAP.MOTIVE
                  ) {
                    handleOpenResource(item);
                  }
                }}>
                View integration
              </button>
            </div>
          </div>
        ))}
      </div>
      <ResourceDialog
        isOpen={isResourceOpen}
        onClose={handleCloseResource}
        content={currentContent}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
      />
      <MotiveResources
        isOpen={isResourceOpen}
        onClose={handleCloseResource}
        content={currentContent}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
      />
      {/* <IntegrationsDialogDetail
      isOpen={isResourceDetailOpen}
      onClose={handleCloseResourceDetail}
      content={currentContent}
    /> */}
    </div>
  );
};
