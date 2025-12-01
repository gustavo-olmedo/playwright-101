import HomeBanner from './components/Banner/HomeBanner';
import ChallengeList from './components/Lists/ChallengeList';

export default function Page() {
  return (
    <div
      className="flex flex-col min-h-screen bg-gray-800 text-gray-100 pt-6"
      id="homePage"
    >
      <HomeBanner />
      <ChallengeList />
    </div>
  );
}
