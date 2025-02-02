import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  StyleSheet,
  View,
  Animated,
  StatusBar,
  FlatList,
  Modal,
  Pressable,
  ActivityIndicator,
  Text,
} from "react-native";
import { useTheme, IconButton, FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../context/UseUser";
import {
  auth,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  doc,
  updateDoc,
  firestore,
  getDoc,
} from "../firebase/Config";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

import GalleryHeader from "../components/GalleryHeader";
import GalleryMenu from "../components/GalleryMenu";
import GalleryImage from "../components/GalleryImage";
import Loading from "../components/Loading";

export default function Gallery() {
  const { fname, lname, username, weight, height, profilePic } = useUser();
  const { colors, spacing } = useTheme();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [menuVisible, setMenuVisible] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [likedImages, setLikedImages] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [gridSize, setGridSize] = useState(2);
  const [imageQuality, setImageQuality] = useState("high");

  const handleSelectMode = useCallback(() => {
    setSelectMode((prev) => !prev);
    setSelectedImages([]);
  }, []);

  const scrollY = useRef(new Animated.Value(0)).current;
  const menuIconRef = useRef();
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (shouldRefresh) {
      handleLoadImages();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  useEffect(() => {
    const fetchLikedImages = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userRef = doc(
          firestore,
          `users/${userId}/omattiedot/perustiedot`
        );
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().likedImages) {
          setLikedImages(docSnap.data().likedImages);
        }
      } catch (error) {
        console.error("Error fetching liked images:", error);
      }
    };
    fetchLikedImages();
  }, []);

  const handleLoadImages = async () => {
    setLoading(true);
    try {
      const loadedImages = await loadImages(auth.currentUser.uid);
      setImages(loadedImages);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async (userId) => {
    const imagesRef = ref(storage, `users/${userId}/images`);
    try {
      const result = await listAll(imagesRef);
      if (result.items.length === 0) return [];

      const urls = await Promise.all(
        result.items.map(async (imageRef) => {
          try {
            const url = await getDownloadURL(imageRef);
            const metadata = await getMetadata(imageRef);
            return {
              url,
              path: imageRef.fullPath,
              filename: imageRef.name,
              timestamp:
                metadata.customMetadata?.timestamp || metadata.timeCreated,
            };
          } catch (error) {
            return null;
          }
        })
      );

      return urls.filter(Boolean);
    } catch (error) {
      console.error("Error listing images:", error);
      return [];
    }
  };

  const uploadImage = async (uri, path) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, path);

    const metadata = {
      customMetadata: {
        timestamp: new Date().toISOString(),
      },
    };

    await uploadBytes(imageRef, blob, metadata);
  };

  const handlePickImage = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const path = `users/${auth.currentUser.uid}/images/${Date.now()}`;
        await uploadImage(uri, path);
        const imageRef = ref(storage, path);
        const url = await getDownloadURL(imageRef);
        const metadata = await getMetadata(imageRef);

        setImages((prev) => [
          ...prev,
          {
            url,
            path,
            filename: path.split("/").pop(),
            timestamp:
              metadata.customMetadata?.timestamp || metadata.timeCreated,
          },
        ]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    setLoading(true);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        throw new Error("Tarvitsemme kameran käyttöoikeuden ottaaksesi kuvia");
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [9, 16],
        quality: imageQuality === "high" ? 1 : 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const path = `users/${auth.currentUser.uid}/images/${Date.now()}`;
        await uploadImage(uri, path);
        const imageRef = ref(storage, path);
        const url = await getDownloadURL(imageRef);
        const metadata = await getMetadata(imageRef);

        setImages((prev) => [
          ...prev,
          {
            url,
            path,
            filename: path.split("/").pop(),
            timestamp:
              metadata.customMetadata?.timestamp || metadata.timeCreated,
          },
        ]);
      }
    } catch (error) {
      console.error("Camera capture failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (path) => {
    setLoading(true);
    try {
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
      setSelectedImage(null);
      setShouldRefresh(true);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = useCallback((newSortOrder) => {
    setSortOrder(newSortOrder);
  }, []);

  const handleMenuDismiss = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const showMenu = useCallback(() => {
    const iconButton = menuIconRef.current;
    if (iconButton) {
      iconButton.measure((x, y, width, height, pageX, pageY) => {
        requestAnimationFrame(() => {
          setMenuPosition({
            x: pageX + width - 170,
            y: pageY + height + 5,
          });
          setMenuVisible(true);
        });
      });
    }
  }, []);

  const sortedImages = useMemo(() => {
    let sorted = [...images];
    if (sortOrder === "liked") {
      return sorted.filter((img) => likedImages.includes(img.path));
    }
    return sorted.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [images, sortOrder, likedImages]);

  const renderItem = useCallback(
    ({ item }) => (
      <GalleryImage
        item={item}
        onPress={
          selectMode ? () => handleImageSelect(item.path) : setSelectedImage
        }
        colors={colors}
        spacing={spacing}
        selectMode={selectMode}
        isSelected={selectedImages.includes(item.path)}
      />
    ),
    [colors, spacing, selectMode, selectedImages]
  );

  const galleryContent = useMemo(
    () =>
      loading ? null : images.length === 0 ? (
        <View style={styles({ colors, spacing }).emptyState}>
          <Text style={{ color: colors.text, fontSize: 18, marginTop: 20 }}>
            Lisää ensimmäinen kuvasi!
          </Text>
        </View>
      ) : (
        <AnimatedFlatList
          data={sortedImages}
          renderItem={renderItem}
          keyExtractor={(item) => item.path}
          numColumns={gridSize}
          columnWrapperStyle={
            gridSize > 1
              ? {
                  justifyContent: "space-between",
                  paddingHorizontal: spacing.small,
                }
              : undefined
          }
          contentContainerStyle={[
            styles({ colors, spacing }).list,
            gridSize === 1 && {
              paddingHorizontal: 0,
              width: "100%",
            },
          ]}
          style={styles({ colors, spacing }).flatList}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          removeClippedSubviews={true}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
          ListEmptyComponent={loading ? <Loading /> : null}
        />
      ),
    [
      loading,
      images,
      sortedImages,
      renderItem,
      scrollY,
      colors,
      spacing,
      gridSize,
    ]
  );

  const handleGridSizeChange = (size) => {
    setGridSize(size);
  };

  const handleImageQualityChange = (quality) => {
    setImageQuality(quality);
  };

  const menuComponent = useMemo(
    () => (
      <GalleryMenu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        position={menuPosition}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onSelectMode={handleSelectMode}
        gridSize={gridSize}
        onGridSizeChange={handleGridSizeChange}
        imageQuality={imageQuality}
        onImageQualityChange={handleImageQualityChange}
      />
    ),
    [menuVisible, menuPosition, sortOrder, gridSize, imageQuality]
  );

  const ImageViewer = useCallback(
    ({ visible, image, onDismiss, onDelete, isDeleting }) => (
      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        statusBarTranslucent={true}
        presentationStyle="overFullScreen"
        onRequestClose={() => !isDeleting && onDismiss()}
      >
        <View style={styles({ colors, spacing }).modalOverlay}>
          <Pressable
            style={styles({ colors, spacing }).modalContent}
            onPress={() => !isDeleting && onDismiss()}
          >
            {image && (
              <>
                <Image
                  source={{ uri: image.url }}
                  style={[
                    styles({ colors, spacing }).modalImage,
                    isDeleting && styles({ colors, spacing }).fadeOut,
                  ]}
                  contentFit="contain"
                  transition={200}
                />
                {isDeleting && (
                  <View style={styles({ colors, spacing }).loadingOverlay}>
                    <ActivityIndicator color="white" size="small" />
                  </View>
                )}
              </>
            )}
          </Pressable>
          {image && (
            <View style={styles({ colors, spacing }).actionBar}>
              <IconButton
                icon={
                  likedImages.includes(image.path) ? "heart" : "heart-outline"
                }
                iconColor="white"
                size={30}
                onPress={() => handleLikeImage(image.path)}
                disabled={isDeleting}
              />
              <IconButton
                icon="delete"
                iconColor="white"
                size={30}
                onPress={() => onDelete(image.path)}
                disabled={isDeleting}
              />
            </View>
          )}
        </View>
      </Modal>
    ),
    [colors, spacing, likedImages, handleLikeImage]
  );

  const handleLikeImage = async (path) => {
    try {
      const userId = auth.currentUser.uid;
      const userRef = doc(firestore, `users/${userId}/omattiedot/perustiedot`);

      if (likedImages.includes(path)) {
        await updateDoc(userRef, {
          likedImages: arrayRemove(path),
        });
        setLikedImages((prev) => prev.filter((p) => p !== path));
      } else {
        await updateDoc(userRef, {
          likedImages: arrayUnion(path),
        });
        setLikedImages((prev) => [...prev, path]);
      }
    } catch (error) {
      console.error("Error updating liked images:", error);
    }
  };

  const handleImageSelect = (path) => {
    setSelectedImages((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleMultipleLike = async () => {
    for (const path of selectedImages) {
      await handleLikeImage(path);
    }
    setSelectMode(false);
    setSelectedImages([]);
  };

  const handleMultipleDelete = async () => {
    for (const path of selectedImages) {
      await handleDeleteImage(path);
    }
    setSelectMode(false);
    setSelectedImages([]);
  };

  const actionBar = useMemo(
    () =>
      selectMode &&
      selectedImages.length > 0 && (
        <View style={styles({ colors, spacing }).multiSelectActionBar}>
          <IconButton
            icon={
              selectedImages.every((path) => likedImages.includes(path))
                ? "heart"
                : "heart-outline"
            }
            iconColor="white"
            size={30}
            onPress={handleMultipleLike}
          />
          <IconButton
            icon="delete"
            iconColor="white"
            size={30}
            onPress={handleMultipleDelete}
          />
        </View>
      ),
    [selectMode, selectedImages, likedImages]
  );

  return (
    <SafeAreaView style={styles({ colors, spacing }).container} edges={["top"]}>
      {galleryContent}

      <GalleryHeader
        opacity={headerOpacity}
        onMenuPress={showMenu}
        menuIconRef={menuIconRef}
        loading={loading}
        takePhoto={handleTakePhoto}
        pickImage={handlePickImage}
        colors={colors}
        spacing={spacing}
      />

      {menuComponent}

      <ImageViewer
        visible={selectedImage !== null}
        onDismiss={() => setSelectedImage(null)}
        image={selectedImage}
        onDelete={handleDeleteImage}
        isDeleting={isDeleting}
      />
      {actionBar}
    </SafeAreaView>
  );
}

const styles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {
      padding: spacing.small,
      paddingTop: 100,
      paddingBottom: 40,
    },
    flatList: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
      backgroundColor: colors.background,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      justifyContent: "center",
    },
    modalContent: {
      flex: 1,
      justifyContent: "center",
    },
    modalImage: {
      width: "100%",
      height: "80%",
      borderRadius: 12,
    },
    fadeOut: {
      opacity: 0.3,
    },
    loadingOverlay: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: [{ translateX: -12 }, { translateY: -12 }],
      zIndex: 10,
    },
    actionBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: spacing.medium,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    multiSelectActionBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: spacing.medium,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  });
