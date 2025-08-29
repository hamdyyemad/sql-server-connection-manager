import CardsContainer from "./components/(home)/CardsContainer";
import ConnectionPortal from "./components/(home)/ConnectionPortal";

export default function Index() {
  return (
    <div className="p-6 space-y-6 relative">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-extralight text-white/50">Connections</h3>
      </div>
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 mt-3.5">
            <CardsContainer />
          </div>
        </div>

      {/* Connection Modal & Connection Selector */}
        <ConnectionPortal />
      </div> 
    </div>
  );
}
