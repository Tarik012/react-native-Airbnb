import { Ionicons } from "@expo/vector-icons";

// fonction qui ajoute les étoiles en focntion de la note
export const getStars = (nbYellowStars) => {
  const tab = [];
  for (let index = 0; index < 5; index++) {
    index < nbYellowStars
      ? tab.push(<Ionicons name="star" size={24} color="gold" key={index} />)
      : tab.push(<Ionicons name="star" size={24} color="grey" key={index} />);
  }
  return tab;
};

//export const ... autre fonction
