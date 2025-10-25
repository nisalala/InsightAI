import React from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-2xl px-4 py-3 rounded-lg
        ${isUser 
          ? 'bg-teal-600 text-white' 
          : 'bg-gray-100 text-gray-900'
        }
      `}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.metadata && (
          <div className="mt-2 pt-2 border-t border-gray-300/30 text-xs opacity-75">
            Query executed in {message.metadata.executionTime}ms
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
