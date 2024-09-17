import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../config';
import { isWithinTradingHours } from '../utils/helper';
import moment from 'moment-timezone';

const BotTimeContext = createContext();

export function BotTimeProvider({ children }) {
    const [botTimes, setBotTimes] = useState({});
    const { currentUser } = useSelector((state) => state.user);

    const syncBotTimes = useCallback(async () => {
        if (currentUser?.id) {
            try {
                const response = await api.get(`/api/v1/ai-trading-bots/getBotsByUserId/${currentUser.id}`);

                const { bots } = response.data;

                if (!Array.isArray(bots)) {
                    console.error('Bots data is not an array:', bots);
                    return;
                }


                setBotTimes((prevTimes) => {
                    const updatedTimes = {};
                    const storedTimes = JSON.parse(localStorage.getItem('botTimes') || '{}');

                    bots.forEach(bot => {
                        updatedTimes[bot._id] = {
                            ...storedTimes[bot._id],
                            workingTime: storedTimes[bot._id]?.workingTime || 0,
                            todaysBotTime: storedTimes[bot._id]?.todaysBotTime || 0,
                            currentWeekTime: storedTimes[bot._id]?.currentWeekTime || 0,
                            lastUpdated: storedTimes[bot._id]?.lastUpdated || moment().tz("Asia/Kolkata").startOf('isoWeek').format(),
                            status: bot.dynamicData[0].status
                        };
                    });

                    localStorage.setItem('botTimes', JSON.stringify(updatedTimes));
                    return updatedTimes;
                });

                console.log('Bot times synced with database');
            } catch (error) {
                console.error('Error syncing bot times:', error);
            }
        }
    }, [currentUser]);

    useEffect(() => {
        const storedTimes = JSON.parse(localStorage.getItem('botTimes') || '{}');
        setBotTimes(storedTimes);

        syncBotTimes();
        const syncInterval = setInterval(syncBotTimes, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(syncInterval);
    }, [syncBotTimes]);

    useEffect(() => {
        const updateBotTimes = () => {
            setBotTimes((prevTimes) => {
                const updatedTimes = { ...prevTimes };
                const now = moment().tz("Asia/Kolkata");
                const startOfCurrentWeek = now.clone().startOf('isoWeek');

                Object.keys(updatedTimes).forEach((botId) => {
                    const bot = updatedTimes[botId];
                    const lastUpdated = moment.tz(bot.lastUpdated, "Asia/Kolkata");

                    // Check if we've crossed into a new week
                    if (now.isAfter(lastUpdated, 'isoWeek')) {
                        bot.currentWeekTime = 0;
                        bot.lastUpdated = startOfCurrentWeek.format();
                    }

                    // Check if we've crossed into a new day
                    if (now.isAfter(lastUpdated, 'day')) {
                        bot.todaysBotTime = 0;
                    }

                    if (bot.status === 'Running' && isWithinTradingHours()) {
                        bot.workingTime += 1;
                        bot.todaysBotTime += 1;
                        bot.currentWeekTime += 1;
                        bot.lastUpdated = now.format();
                    }
                });

                localStorage.setItem('botTimes', JSON.stringify(updatedTimes));
                return updatedTimes;
            });
        };

        const interval = setInterval(updateBotTimes, 1000);
        return () => clearInterval(interval);
    }, []);

    const updateBotTime = useCallback((botId, status) => {
        setBotTimes((prevTimes) => {
            const updatedTimes = { ...prevTimes };
            if (!updatedTimes[botId]) {
                updatedTimes[botId] = {
                    workingTime: 0,
                    todaysBotTime: 0,
                    currentWeekTime: 0,
                    lastUpdated: moment().tz("Asia/Kolkata").startOf('isoWeek').format(),
                    status
                };
            } else {
                updatedTimes[botId].status = status;
            }
            localStorage.setItem('botTimes', JSON.stringify(updatedTimes));
            return updatedTimes;
        });
    }, []);

    const formatTime = useCallback((seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    }, []);

    return (
        <BotTimeContext.Provider value={{ botTimes, updateBotTime, formatTime }}>
            {children}
        </BotTimeContext.Provider>
    );
}

export function useBotTime() {
    return useContext(BotTimeContext);
}