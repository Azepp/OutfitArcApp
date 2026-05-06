import HomeHeader from "@/components/home/homeHeader";
import SwitchMode from "@/components/home/switchMode";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import HomeContent from "@/components/home/homeContent";

export default function HomeScreen() {
  return (
    <ParallaxScrollView headerImage={require("@/assets/images/hero/bg-image.webp")} headerContent={<HomeHeader />}>
      <HomeContent />
      <SwitchMode />
    </ParallaxScrollView>
  );
}
