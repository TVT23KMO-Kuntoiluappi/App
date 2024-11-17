import React, { useCallback } from 'react'
import { Menu, Portal } from 'react-native-paper'

export default React.memo(function GalleryMenu({ 
  visible, 
  onDismiss, 
  position, 
  sortOrder, 
  onSortChange 
}) {
  const handleSort = useCallback(() => {
    const newOrder = sortOrder === 'newest' ? 'oldest' : 'newest'
    onSortChange(newOrder)
    onDismiss()
  }, [sortOrder, onSortChange, onDismiss])

  return (
    <Portal>
      <Menu
        visible={visible}
        onDismiss={onDismiss}
        anchor={position}
      >
        <Menu.Item
          title="Järjestele"
          leadingIcon="sort"
          trailingIcon={sortOrder === 'newest' ? 'arrow-down' : 'arrow-up'}
          onPress={handleSort}
        />
        <Menu.Item
          title="Valitse useita"
          leadingIcon="checkbox-multiple-marked"
          onPress={onDismiss}
        />
        <Menu.Item
          title="Asetukset"
          leadingIcon="cog"
          onPress={onDismiss}
        />
      </Menu>
    </Portal>
  )
})