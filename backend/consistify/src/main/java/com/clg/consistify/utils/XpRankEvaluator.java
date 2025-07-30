package com.clg.consistify.utils;

import com.clg.consistify.user.UserModel;

public abstract class XpRankEvaluator {
    protected String calculateRank(int xp){
        if (xp > 5000) {
            return "S";
        } else if (xp > 3000) {
            return "A";
        } else if (xp > 1000) {
            return "B";
        } else if (xp > 500) {
            return "C";
        } else if (xp > 100) {
            return "D";
        } else {
            return "E";
        }
    }
    public abstract void evaluateRank(UserModel user);
}
