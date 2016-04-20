package org.dictionary.service;

//import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
//import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.dictionary.api.MultipleChoiceQuestionAPI;
import org.dictionary.api.MultipleChoiceQuizAPI;
import org.dictionary.api.WordAPI;
import org.dictionary.repository.search.TranslationSearchRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

public class DefaultMultipleChoiceQuizServiceTest {

    private WordService wordService = mock(WordService.class);
    private TranslationService translationService = mock(TranslationService.class);
    private TranslationSearchRepository translationSearchRepository = mock(TranslationSearchRepository.class);

    private MultipleChoiceQuizService service;

    @Before
    public void init() {
        service = new DefaultMultipleChoiceQuizService();
        ReflectionTestUtils.setField(service, "wordService", wordService);
        ReflectionTestUtils.setField(service, "translationService", translationService);
        ReflectionTestUtils.setField(service, "translationSearchRepository", translationSearchRepository);
    }

    @Test
    public void testSetCorrectAnswers() {
        MultipleChoiceQuizAPI quiz = new MultipleChoiceQuizAPI();
        List<MultipleChoiceQuestionAPI> questions = new ArrayList<MultipleChoiceQuestionAPI>();
        MultipleChoiceQuestionAPI question1 = createQuestion(1, 11, 12);
        questions.add(question1);
        MultipleChoiceQuestionAPI question2 = createQuestion(2, 21, 22);
        questions.add(question2);
        quiz.setQuestions(questions);

        when(translationSearchRepository.countByFromWordIdAndToWordId(1L, 11L)).thenReturn(0);
        when(translationSearchRepository.countByFromWordIdAndToWordId(1L, 12L)).thenReturn(1);

        when(translationSearchRepository.countByFromWordIdAndToWordId(21L, 2L)).thenReturn(1);

        service.setCorrectAnswers(quiz);

        Assert.assertEquals(quiz.getQuestions().get(0).getCorrectAnswerWordId().longValue(), 12L);
        Assert.assertEquals(quiz.getQuestions().get(1).getCorrectAnswerWordId().longValue(), 21L);
    }

    private MultipleChoiceQuestionAPI createQuestion(long wordId, long... answerIds) {
        MultipleChoiceQuestionAPI question = new MultipleChoiceQuestionAPI();
        WordAPI word = new WordAPI();
        word.setId(wordId);
        question.setWord(word);
        Set<WordAPI> answersWord = new HashSet<WordAPI>();
        for (long answerId: answerIds) {
            WordAPI answerWord = new WordAPI();
            answerWord.setId(answerId);
            answersWord.add(answerWord);
        }
        question.setAnswers(answersWord);
        return question;
    }
}
