import React from "react";
import { Menu, Portal } from "react-native-paper";

export default React.memo(function GalleryMenu({
  visible,
  onDismiss,
  position,
  sortOrder,
  onSortChange,
  onSelectMode,
  gridSize,
  onGridSizeChange,
  imageQuality,
  onImageQualityChange,
}) {
  const [showSortMenu, setShowSortMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState(position);
  const [showSettingsMenu, setShowSettingsMenu] = React.useState(false);

  return (
    <Portal>
      <Menu visible={visible} onDismiss={onDismiss} anchor={position}>
        <Menu.Item
          title="Järjestele"
          leadingIcon="sort"
          onPress={() => {
            const newPosition = {
              x: position.x - 50,
              y: position.y + 50,
            };
            setShowSortMenu(true);
            setMenuPosition(newPosition);
          }}
        />
        <Menu.Item
          title="Valitse useita"
          leadingIcon="checkbox-multiple-marked"
          onPress={() => {
            onDismiss();
            onSelectMode();
          }}
        />
        <Menu.Item
          title="Asetukset"
          leadingIcon="cog"
          onPress={() => {
            const newPosition = {
              x: position.x - 50,
              y: position.y + 50,
            };
            setShowSettingsMenu(true);
            setMenuPosition(newPosition);
          }}
        />
      </Menu>

      <Menu
        visible={showSortMenu}
        onDismiss={() => setShowSortMenu(false)}
        anchor={menuPosition}
      >
        <Menu.Item
          title="Uusimmat ensin"
          leadingIcon={sortOrder === "newest" ? "check" : undefined}
          onPress={() => {
            onSortChange("newest");
            setShowSortMenu(false);
            onDismiss();
          }}
        />
        <Menu.Item
          title="Vanhimmat ensin"
          leadingIcon={sortOrder === "oldest" ? "check" : undefined}
          onPress={() => {
            onSortChange("oldest");
            setShowSortMenu(false);
            onDismiss();
          }}
        />
        <Menu.Item
          title="Näytä tykätyt"
          leadingIcon={sortOrder === "liked" ? "check" : undefined}
          onPress={() => {
            onSortChange("liked");
            setShowSortMenu(false);
            onDismiss();
          }}
        />
      </Menu>

      <Menu
        visible={showSettingsMenu}
        onDismiss={() => setShowSettingsMenu(false)}
        anchor={menuPosition}
      >
        <Menu.Item
          title={`Näytä: ${gridSize === 2 ? "1" : "2"} rin.`}
          leadingIcon="view-grid"
          onPress={() => {
            const newSize = gridSize === 2 ? 1 : 2;
            onGridSizeChange(newSize);
            setShowSettingsMenu(false);
            onDismiss();
          }}
        />
        <Menu.Item
          title={`Kuvien laatu: ${
            imageQuality === "high" ? "Korkea" : "Matala"
          }`}
          leadingIcon="image"
          onPress={() => {
            const newQuality = imageQuality === "high" ? "low" : "high";
            onImageQualityChange(newQuality);
            setShowSettingsMenu(false);
            onDismiss();
          }}
        />
      </Menu>
    </Portal>
  );
});
