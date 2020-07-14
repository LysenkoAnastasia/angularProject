interface MarkerOptions {
    // ='_id' by default, need to set if unique marker field is different from '_id'
    idField: string;
    // countClusterBelongings,  //function(pointsArray) => number of belongings of all markers in cluster;
    //                           set instead of belongField if belongField can contain more then one value
    selectedMarkerColour: string;  // цвет для выделенного маркера (поставить по умолчанию серый?),
    // function(point1, point2) => boolean (to draw arrows between markers), markers are sorted using this compare func
    comparePoints: (pointAId: string, pointBId: string) => -1 | 0 | 1;
    // function(point1, point2) => boolean, returns true if do not need to draw arrow between these markers
    noTrajectory: (pointAId: string, pointBId: string) => boolean;
    // function() =>  [ [first array of marker ids], [second],... ] - array of sequences of marker ids,
    // each sequence of markers will be connected with paths (arrows)
    // if not null - arrays will be used instead of sorting markers with comparePoints and checking with noTrajectory
    // рисует пути со стрелками
    getPathSequences: (points: string[][]) => any;
    // радиус вокруг маркера, при котором маркеры будут объединяться в кластер, по умолчанию 0.000001
    // в пикселях
    maxClusterRadius: number;
    // иконка маркера по умолчанию (необязательно; если не указана - то белый кружок)
    // base64
    defaultMarkerImage: string;
    // function to get colour for marker, if this one not set -
    // point.markerColour or defaultMarkerColour will be used
    // returns '#xxxxxx'
    getMarkerColour: (point: Point) => string;
    // function which returns object with fields which
    // are expected to be in point (marker.data) but were moved to other place (for ex. for map results bs info was saved separately from results data)
  // getAdditionalMarkerData: (point: Point) => any;

    //  returns html string with popup content,
    //  if is_cluster is true - need to return popup content only with common info for all markers inside current cluster
    //  point - data of single point from cluster or single point to get popup with full info
    getCustomPopupContent: (point: Point, isCluster: boolean) => string;
    maxMarkersInClusterToSpiderfy; // {int}, number of markers inside cluster, when cluster will not be spiderfied - too much to spiderfy
    // instead - will show popup for cluster (got using getCustomPopupContent) with common info for all markers
    // if set to true, overrides the icon for all added markers to make them appear as a 1 size cluster
    singleMarkerMode: boolean;
    // if set to true - after add points in this.addPointsToMap map will be centered to all markers
    centerMapOnAddPoints: boolean;

    // ------------------- not finished yet --------------------
    // field of marker data with geojson of its sector
    // sectorGeojsonField,
    // sectorRealsizeGeojsonField //field of marker data with geojson of its sector (sector radius is real - in proper zoom)
}

interface Point {
    id: string;
    latitude: number;
    longitude: number;
    azimut: number;
    radius: number;
    markerImage?: string;  // для отриосвки маркера на карте (base64 image)
    markerColour?: string; // (or this.markerOptions.getColour(belongField) should be defined, or defaultMarkerColour),
}



interface MapOptions {
    // id html элемента   required
    mapId: string;
    // url тайлов
    mapUrl: string;
    // центр карты
    mapCenter: [number, number];
    // начальный зум карты
    mapZoom: number;
    // массив названий классов объектов, в которых объявлены кнопки, изображенные на карте,
    // указанные классы будут скрыты при печати карты (модуль map.export-to-png.js), чтобы кнопки на карте не попали на png-картинку
    printerHideClasses: string[];
    markerOptions?: MarkerOptions;
}

/**
 * Инкапсулирует общие свойства карт,
 * позволяет использовать компоненты :
 *    map.edit-layers.js
 *    map.export-to-png.js
 **/
interface NtMapInterface {

    init(mapOptions: MapOptions);


    /**
     * подписка на события карты
     * @param event - событие
     * @param callback - метод, который будет вызван при указанном событии
     */
//   on(event: string, callback: (data: any) => void): void;
//   fire(event: string, data: any): void;
//   unsubscribe(event: string, callback: (data: any) => void): void;

    /**
     * обновить границы карты после изменения размера страницы
     */
    invalidateSize(): void;

    /**
     * Отобразить слой на карте
     * @param id - идентификатор слоя
     * @param geojson {Object} - json
     */
    addLayer(id: string, geojson);

    /**
     * Убрать слой с карты
     */
    deleteLayer(id: string): void;

    // /**
    //  * удалить с карты все слои, добавленные через addLayer()
    //  */
    // deleteShownLayers();

    // /**
    //  * получить все слои карты, добавленные через addLayer()
    //  * @returns [] - array of layers objects
    //  */
    // getShownLayersArray(): any[];


    // --------------------- edit layers module ------------------------
    // модуль для рисования и изменения фигур на карте (полигонов и кругов)

    // return true if no figures drawn on map now (to disable edit-delete buttons because nothing to edit-delete)
    noFiguresDrawn(): boolean;

    /**
     * выйти из режима рисования фигуры
     */
    resetDrawing();

    // /**
    //  * то же самое, что и getShownLayersArray, но для нарисованных пользователем слоев
    //  */
    // getAllDrawnLayersArray(): any[];

    // /**
    //  * начать/закончить рисовать круг
    //  * switch edit modes: enable-disable "draw circle/polygon", "edit/delete figures"
    //  */
    // switchCircleDraw();
    //
    // /**
    //  * начать/закончить рисовать полигон
    //  */
    // switchPolygonDraw();
    //
    // /**
    //  * начать/закончить изменение фигуры
    //  */
    // switchEditMode();
    //
    // /**
    //  * начать/закончить режим удаления фигуры
    //  */
    // switchDeleteMode();

    /**
     * Начать режим рисования круга с заданным цветом
     * @param color
     */
    drawCircle(color: string);

    /**
     * Дать пользователю возможность нарисовать многоугольник
     */
    drawPolygon(color: string);

    /**
     * Сохранить изменения
     */
    saveChanges();

    // /**
    //  * Сбросить изменения при редактировании/рисовании
    //  */
    // revertChanges();

    /**
     * добавить на карту геоджсон с полигонами и кругами для редактирования, либо хотя бы для просмотра
     * @param geojson
     */
    setEditableLayer(geojson: any);

    /**
     * получить слои с геоджсонами, добавленными только для просмотра
     */
    getNotEditableLayersArray(): any[];

    /**
     * Вернуть geojson слоя, на котором рисуем
     * @returns {Object}
     */
    getGeojson(): any;

    /**
     * Очистить слой - удалить с него все фигуры
     * При создании слоя/ перключении на другой слой:
     *  1) последний открытый слой приводится к geojson (getGeojson())
     *      и сохранеятся в переменную в массиве layers
     *  2) для нового слоя с карты удаляются все фигуры
     */
    resetLayer();
    //
    // /**
    //  * отключить режим рисования фигур
    //  */
    // disableAll();

    // ---------------------- markers module ----------------------------------

    /**
     * модуль для работы с маркерами на карте
     *
     * параметры для инициализации модуля:
     * @param mapOptions
     *
     * when add api for operations (add-show-hide-remove) with markers need:
     * update this._allMarkers (on add-remove markers),
     * update this._visibleMarkers
     * update this.selectedPoints (on remove markers)
     * update sectors         (if enabled)
     * update paths           (if enabled)
     * update filter by layer (if enabled)
     *
     */

    /**
     *  добавить маркеры на карту
     *  @param points;
     *  point = { _id,
     *    latitude, longitude, azimut, radius,  markerImage?  // для отриосвки маркера на карте (markerImage - необязательно)
     *    markerColour (or this.markerOptions.getColour(belongField) should be defined, or defaultMarkerColour),
     *   }
     *   if some fields are not present in point but needed, map will try to get values of these fields with this.mapOptions.getAdditionalMarkerData(point)
     */
    addPointsToMap(points: Point[]);

    /**
     * удалить заданные точки с карты
     * @param pointsIds - точки для удаления
     * @param skipHidden - надо ли оставить на карте скрытые маркеры
     */
    removePointsFromMap(pointsIds: Set<string>, skipHidden: boolean);

    /**
     * удалить все точки с карты
     */
    removeAllPointsFromMap();

    // // внутренние методы для создания маркеров
    // /**
    //  * обновить цвет для всех маркером
    //  * @param belongFieldValue - значение point[belongField (см. addPoints описание point)
    //  * @param newColour - новый цвет для всех маркеров с point.belongField == belongFieldValue
    //  */
    // updateMarkersColourForBelong(predicate: (point: any) => boolean, newColour: string);

    // /**
    //  * см. updateMarkersColourForBelong
    //  * @param markerIds - массив id маркеров, для которых надо поменять цвет
    //  * @param newColour - новый цвет для маркеров с id из markerIds
    //  */
    // updateMarkersColourForIds(markerIds: string[], newColour: string);


    // ---------------------------- для поповеров -------------------------------------

    /**
     * закрывает все всплывающие окна всех маркеров
     */
    hideAllPopups();

//   выделение маркеров
//
//   getNumberOfSelectedMarkers(): number;
//
//   getNumberOfHiddenMarkers(): number;
//
//   unselectAllMarkers();
//
//   selectAllMarkers();
//
//   /**
//    * select markers by id
//    */
//   selectMarkers(markersIds: string[], selected: boolean);
//
//   changeMarkerSelection(markerId: string, selected: boolean, refreshClusters: boolean);
//
//   invertSelection();
//
//   /**
//    * скрыть выделенные маркеры
//    */
//   hideSelectedPoints();
//
//   /**
//    * показать скрытые маркеры
//    */
//   showHiddenPoints();
//
//   removeSelectedPoints();
//
//   removeAllExceptSelectedPoints();

//   /**
//    * начать рисование прямоугольника (для выделения маркеров)
//    */
//   drawRectangle();
//
//   disableDrawRectangle();
//
//   enable-disable draw mode
//   switchRectangleDraw();

    // для секторов

//   /**
//    * изменить режим отображения секторов
//    * @param show  - boolean, скрыть/показать сектора
//    * @param realSize - boolean, использовать фиксированный/реальный размер секторов
//    */
//   changeSectorMode(show: boolean, realSize: boolean);

    // для траекторий

    /**
     * Отображает траектории между маркерами с одинаковой принадлежностью
     * (выбирает маркеры с одинаковым belongField, сортирует их с помощью compare, рисует между ними линии со стрелками)
     * при создании объекта LeafletMap необходимо указать markerOptions с полями belongField и compare
     * НО, если указана функция this.markerOptions.getPathSequences, то см.метод _showPredefinedPaths
     */
    showPaths();

    /**
     * Удаляет все траектории с карты
     */
    removePaths();

//   для фильтрации по слою
//
//   /**
//    * Скрывает все маркеры, которые не входят в слой layer (фильтрует маркеры по слою)
//    * @param layer {Object} = { geojson }
//    */
//   enableFilterByLayer(layer);
//
//   reapplyFilterLayer();
//
//   disableFilterByLayer();
//
//   /**
//    * возвращает массив _id точек на карте после применения фильтра
//    */
//   getPointsOnMapAfterFilter(): string[];
//
//   вспомогательные методы
//
//   to update colour of cluster after markers were selected/unselected from outside
//   if markers set - update only clusters with these markers, if markers not set - update all clusters
//   refreshClustersColours(markers: string[]);

    /**
     * центрировать карту к указанным точкам
     * @param points - массив идентификаторов точек
     */
    fitToPoints(points: string[]);

    /**
     * Зумим карту так, чтобы было видно все маркеры
     */
    fitToAllPoints();

//  fitToClusterBounds(cluster: string);

    // ------------------------ модуль heatmap ----------------------------

    /**
     * удалить все точки с heatmap
     */
    removeAllPointsFromHeatmap();

    /**
     * remove specified points from _heatLayer
     * @param points {Set<string>} - set of ids of points to remove
     */
    removePointsFromHeatmap(points: Set<string>);

    /**
     * add points to heatmap (_heatLayer)
     * @param points - {Array<Object>} - array of points to add (see this.addPointsToMap - from map.markers.js)
     * points[i] { _id, latitude, longitude,
     *             ..trajectories and sectors info(see map.markers.js)}
     */
    addPointsToHeatmap(points: { _id: string, latitude: number, longitude: number }[]);

    /**
     * переключение режима отображения точек
     * переключение между двумя режимами:
     * 1 - отображения маркеров и кластеров (методами map.markers.js)
     * 2 - отображение тепловой карты (методами map.heatmap.js)
     */
    switchMapMode();


    // -----------------------  модуль tile-servers ----------------------------
    // для отображения "подложек" - картинок слоев поверх карты

//   /**
//    * adds tile server to map
//    * @param url {string} - url of tileServer
//    * @param name {string} - name of layer to load
//    * @returns {string}
//    */
//   addTileServer(url: string, name: string);
//
//   /**
//    * remove layer added by addTileServer
//    * @param key {string} -  returned after adding tileServer by addTileServer
//    */
//   removeTileServer(key);
//
//   removeAllTileServers();

    // ------------------------- модуль server-clusters -----------------------------
    // для загрузки маркеров с сервера постоянно при перемещании карты и изменении ее размера

//   /**
//    * after map zoom changed need to remove all points from map, reload clusters for new zoom and add them to map
//    * @param fitBounds {L.latLngBounds} - bounds of viewport to load clusters (if not set - will take actual map bounds
//    */
//   reloadClusters(fitBounds);
//
//   /**
//    * сброс таймера, чтобы отменить перезагрузку кластеров, если
//    * в течение указанного таймаута карта снова масштабировалась или сдвигалась
//    */
//   resetTimeout();
//
//   /**
//    * добавление точек на карту с учетом того, что среди них могут быть
//    * выделенные маркеры или кластеры с выделенными макркерами (с перекрашиванием их в соответствующий цвет)
//    * @param points - массив кластеров и маркеров, см. метод addPointsToMap
//    */
//   serverAddPointsToMap(points);
//
//   /**
//    * to remove all points from map after zoom changed or map moved (without unselecting markers)
//    */
//   serverRemoveAllPointsFromMap();
//
//   // show/hide, apply/cancel layers
//
//   /**
//    * находит id маркеров, которые попадают в слой layer
//    * @param layer - объект L.FeatureGroup
//    * @return {Set<string>} - id маркеров, которые попадают в слой layer
//    */
//   getMarkersInsideLayer(layer);
//
//   reselectMarkers(bsArray: string[], replace: boolean);
//
//   /**
//    * применение фигур слоя, нарисованных пользователем (реализация из map.edit-layers.js)
//    * выделяет (перекрашивает в цвет выделенных маркеров) маркеры, которые внутри нарисованного слоя
//    * @return {Set<string>} - список id маркеров, которые попали в нарисованный слой
//    */
//   applyEditableLayer(): Set<string>;
//
//   /**
//    * проверяет все примененные слои (из списка слоев) и нарисованный слой и
//    * выбирает все маркеры, которые входят в эти слои
//    * отменяет выбор всех предыдущих маркеров, выбирает все попавшие в слои маркеры заново
//    *
//    * @return {Set<string>} - список id всех маркеров, попавших в слои
//    */
//   updateMarkersSelectionInAllLayers(): Set<string>;
//
//   /**
//    * помечает выбранными/отменяет выбор всех маркеров из markers_ids
//    * @param markersIds {Set<string>} - список id маркеров, которые надо выбрать
//    * @param selected {boolean} - если true, то выберет маркеры, иначе - отменит выбор
//    */
//   serverChangeSelection(markersIds: Set<string>, selected: boolean);
//
//   /**
//    * отменяет выбор всех маркеров
//    */
//   serverUnselectAllMarkers();
//
//   //  switch to offline mode (when clusters loading only drawn layers)
//   switchServerMode(serverMode);

    // --------------------------- модуль export to png ------------------------

    /**
     * преобразует видимую часть карты с заданными шириной и высотой в png
     * @param params
     */
    exportToPng(params?: { height: number, width: number });

    // -------------------------- модуль coordinates ---------------------------

    /**
     * добавляет в угол карты координаты указателя
     */
    addMouseCoordinates();

    // ----------------------- модуль measure -----------------------

    /**
     * включает/отключает режим линейки для измерения расстояния на карте
     */
    toggleMeasureRoler();

}
