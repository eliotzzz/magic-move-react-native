package com.ijzerenhein.magicmove;

import android.view.View;
import android.graphics.RectF;

public class ReactMagicMoveCloneData {
    private final String sharedId;
    private final View view;
    private final RectF layout;
    private final int options;
    private int refCount;

    public ReactMagicMoveCloneData(String sharedId, View view, RectF layout, int options) {
        this.sharedId = sharedId;
        this.view = view;
        this.layout = layout;
        this.options = options;
        this.refCount = 1;
    }

    public String getSharedId() {
        return sharedId;
    }

    public View getView() {
        return view;
    }

    public RectF getLayout() {
        return layout;
    }

    public int getOptions() {
        return options;
    }

    int getRefCount() {
        return refCount;
    }

    void setRefCount(int refCount) {
        this.refCount = refCount;
    }

    public String getKey() {
        return keyForSharedId(sharedId, options);
    }

    private static String keyForSharedId(String sharedId, int options) {
        String type = ((options & ReactMagicMoveCloneOption.SCENE) != 0) ?
                (((options & ReactMagicMoveCloneOption.TARGET) != 0) ? "TargetScene" : "SourceScene") :
                (((options & ReactMagicMoveCloneOption.TARGET) != 0) ? "TargetComponent" : "SourceComponent");
        return type + ":" + sharedId;
    }
}
