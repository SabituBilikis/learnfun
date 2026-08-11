import { useParams, useNavigate } from "react-router";
import { PhonicsOverviewScreen } from "@/features/phonics/PhonicsOverviewScreen";
import { PhonicsStepRunner } from "@/features/phonics/PhonicsStepRunner";
import { parseIndexParam } from "@/lib/helpers";
import phonicsData from "@/data/phonics.json";

export function PhonicsRoute() {
  return <PhonicsOverviewScreen />;
}

export function PhonicsLessonRoute() {
  const { index } = useParams();
  const navigate = useNavigate();
  const letterIndex = parseIndexParam(index, phonicsData.length);

  return (
    <PhonicsStepRunner
      index={letterIndex}
      onBack={() => navigate("/phonics")}
      onNavigate={(i) => navigate(`/phonics/lesson/${i}`)}
    />
  );
}
