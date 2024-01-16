import MapView from './MapView';

export default function LeafletMapPane() {
  return (
    <div className="w-[90vw] flex md:gap-2 gap-4 flex-col-reverse sm:flex-row h-max">
      <div className="w-full rounded border p-2 md:max-w-[40%]">
        This is stats view
      </div>
      <div className="w-full rounded border p-2">
        <MapView />
      </div>
    </div>
  );
}
